import jwt from "jsonwebtoken";
import { User } from "@shared/schema";

// JWT Secret for token signing
const JWT_SECRET = process.env.JWT_SECRET || "guru-gyan-rai-secret-key";
// Token expiration time
const TOKEN_EXPIRY = "1d"; // 1 day

// Generate JWT token for a user
export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Express middleware to validate JWT token
export function authenticateJWT(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Authorization token required" });
  }
}

// Express middleware to check admin role with JWT
export function authorizeAdmin(req: any, res: any, next: any) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
}
