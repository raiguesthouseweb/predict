import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { isAuthenticated, isAdmin, createUser } from "./auth/passport";
import { generateToken } from "./auth/jwt";
import { getWeatherData } from "./weather/openWeatherMap";
import {
  searchTeams,
  searchStadiums,
  getTeams,
  getTeamColors,
  getDayColors,
} from "./cricket/csvParser";
import { predictMatch } from "./cricket/prediction/engine";
import { User, loginSchema, registerSchema, predictionFormSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // ===== Auth Routes =====
  
  // Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validationResult = registerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: "Validation error", errors: validationResult.error.errors });
      }
      
      const { username, password } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await createUser({ username, password });
      
      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        
        // Generate JWT token
        const token = generateToken(user);
        
        // Return user info (without password)
        const userResponse = {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
          token
        };
        
        return res.status(201).json(userResponse);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  
  // Login
  app.post("/api/auth/login", (req: Request, res: Response, next) => {
    const validationResult = loginSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ message: "Validation error", errors: validationResult.error.errors });
    }
    
    passport.authenticate("local", (err: Error, user: User) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Generate JWT token
        const token = generateToken(user);
        
        // Return user info (without password)
        const userResponse = {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
          token
        };
        
        return res.json(userResponse);
      });
    })(req, res, next);
  });
  
  // Check auth
  app.get("/api/auth/check", isAuthenticated, (req: Request, res: Response) => {
    const user = req.user as User;
    
    // Return user info (without password)
    const userResponse = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    };
    
    res.json(userResponse);
  });
  
  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Session destruction failed" });
        }
        
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
      });
    });
  });
  
  // ===== Cricket Data Routes =====
  
  // Get/search teams
  app.get("/api/cricket/teams", async (req: Request, res: Response) => {
    try {
      const searchQuery = req.query.search as string;
      
      if (searchQuery) {
        const teams = await searchTeams(searchQuery);
        res.json(teams);
      } else {
        const teams = await getTeams();
        res.json(teams.map(team => team.name));
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });
  
  // Get/search stadiums
  app.get("/api/cricket/stadiums", async (req: Request, res: Response) => {
    try {
      const searchQuery = req.query.search as string;
      const format = req.query.format as string;
      const gender = req.query.gender as string;
      
      if (!format || !gender) {
        return res.status(400).json({ message: "Format and gender are required" });
      }
      
      const stadiums = await searchStadiums(searchQuery || "", format, gender);
      res.json(stadiums);
    } catch (error) {
      console.error("Error fetching stadiums:", error);
      res.status(500).json({ message: "Failed to fetch stadiums" });
    }
  });
  
  // ===== Prediction Routes =====
  
  // Generate prediction
  app.post("/api/predictions", async (req: Request, res: Response) => {
    try {
      const validationResult = predictionFormSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ message: "Validation error", errors: validationResult.error.errors });
      }
      
      const predictionData = req.body;
      
      // Get team colors for color theory analysis
      const teamColors = await getTeamColors();
      const dayColors = await getDayColors();
      
      // Generate prediction
      const result = await predictMatch(predictionData, teamColors, dayColors);
      
      res.json(result);
    } catch (error) {
      console.error("Prediction error:", error);
      res.status(500).json({ message: "Prediction failed", error: String(error) });
    }
  });
  
  // Save prediction (for authenticated users)
  app.post("/api/predictions/save", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      
      const prediction = await storage.createPrediction({
        ...req.body,
        userId: user.id
      });
      
      res.status(201).json(prediction);
    } catch (error) {
      console.error("Error saving prediction:", error);
      res.status(500).json({ message: "Failed to save prediction" });
    }
  });
  
  // Get user predictions
  app.get("/api/predictions/user", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const predictions = await storage.getUserPredictions(user.id);
      
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching user predictions:", error);
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });
  
  // ===== Weather API =====
  
  app.get("/api/weather", async (req: Request, res: Response) => {
    try {
      const city = req.query.city as string;
      const hours = parseInt(req.query.hours as string) || 4;
      
      if (!city) {
        return res.status(400).json({ message: "City parameter is required" });
      }
      
      const weatherData = await getWeatherData(city, hours);
      res.json(weatherData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ message: "Failed to fetch weather data", error: String(error) });
    }
  });
  
  // ===== Admin Routes =====
  
  // Create user (admin only)
  app.post("/api/admin/users", isAdmin, async (req: Request, res: Response) => {
    try {
      const { username, password, isAdmin } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await createUser({ username, password, isAdmin });
      
      // Return user info (without password)
      const userResponse = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      };
      
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("User creation error:", error);
      res.status(500).json({ message: "User creation failed" });
    }
  });
  
  // Get all users (admin only)
  app.get("/api/admin/users", isAdmin, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  // Get all predictions (admin only)
  app.get("/api/admin/predictions", isAdmin, async (req: Request, res: Response) => {
    try {
      const predictions = await storage.getAllPredictions();
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });
  
  // Message endpoints
  app.post("/api/admin/messages", isAdmin, async (req: Request, res: Response) => {
    try {
      const { userId, content } = req.body;
      
      const message = await storage.createMessage({
        userId,
        content,
        fromAdmin: true
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });
  
  app.get("/api/admin/messages", isAdmin, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  
  // User messages
  app.post("/api/messages", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const { content } = req.body;
      
      const message = await storage.createMessage({
        userId: user.id,
        content,
        fromAdmin: false
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });
  
  app.get("/api/messages", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const messages = await storage.getUserMessages(user.id);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  return httpServer;
}
