import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "../storage";
import bcrypt from "bcryptjs";
import { InsertUser, User } from "@shared/schema";

export function configurePassport() {
  // Local Strategy for username/password auth
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        // Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialize user for the session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

// Helper functions for user authentication
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function createUser(userData: {
  username: string;
  password: string;
  isAdmin?: boolean;
}): Promise<User> {
  // Hash the password before storing
  const hashedPassword = await hashPassword(userData.password);
  
  // Create user with hashed password
  const insertUser: InsertUser = {
    username: userData.username,
    password: hashedPassword,
    isAdmin: userData.isAdmin || false,
  };
  
  return storage.createUser(insertUser);
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export function isAdmin(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Admin access required" });
}
