import {
  users,
  predictions,
  messages,
  type User,
  type InsertUser,
  type Prediction,
  type Message
} from "@shared/schema";

// Storage interface for data operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Prediction operations
  createPrediction(prediction: any): Promise<Prediction>;
  getPrediction(id: number): Promise<Prediction | undefined>;
  getUserPredictions(userId: number): Promise<Prediction[]>;
  getAllPredictions(): Promise<Prediction[]>;
  
  // Message operations
  createMessage(message: any): Promise<Message>;
  getMessage(id: number): Promise<Message | undefined>;
  getUserMessages(userId: number): Promise<Message[]>;
  getAllMessages(): Promise<Message[]>;
  markMessageAsRead(id: number): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private predictions: Map<number, Prediction>;
  private messages: Map<number, Message>;
  private userId: number;
  private predictionId: number;
  private messageId: number;

  constructor() {
    this.users = new Map();
    this.predictions = new Map();
    this.messages = new Map();
    this.userId = 1;
    this.predictionId = 1;
    this.messageId = 1;
    
    // Set up initial admin user
    this.setupInitialAdminUser();
  }
  
  private async setupInitialAdminUser() {
    try {
      // Check if we have any users
      if (this.users.size === 0) {
        // Import functions needed to create admin
        const { createUser } = await import('./auth/passport');
        
        // Create admin user with default credentials
        const adminUser = await createUser({
          username: 'admin',
          password: 'admin123',
          isAdmin: true
        });
        
        console.log('Initial admin user created:');
        console.log('Username: admin');
        console.log('Password: admin123');
      }
    } catch (error) {
      console.error('Failed to create admin user:', error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Prediction operations
  async createPrediction(predictionData: any): Promise<Prediction> {
    const id = this.predictionId++;
    const now = new Date();
    
    const prediction: Prediction = {
      id,
      userId: predictionData.userId,
      teamA: predictionData.teamA,
      teamB: predictionData.teamB,
      matchFormat: predictionData.matchFormat,
      gender: predictionData.gender,
      matchDate: predictionData.matchDate,
      stadium: predictionData.stadium,
      teamAScore: predictionData.teamAScore,
      predictionMode: predictionData.predictionMode,
      teamAWinPercentage: predictionData.teamAWinPercentage,
      teamBWinPercentage: predictionData.teamBWinPercentage,
      createdAt: now,
      predictionData: predictionData.predictionData,
      weatherData: predictionData.weatherData
    };
    
    this.predictions.set(id, prediction);
    return prediction;
  }
  
  async getPrediction(id: number): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }
  
  async getUserPredictions(userId: number): Promise<Prediction[]> {
    return Array.from(this.predictions.values())
      .filter(prediction => prediction.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getAllPredictions(): Promise<Prediction[]> {
    return Array.from(this.predictions.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  // Message operations
  async createMessage(messageData: any): Promise<Message> {
    const id = this.messageId++;
    const now = new Date();
    
    const message: Message = {
      id,
      userId: messageData.userId,
      content: messageData.content,
      fromAdmin: messageData.fromAdmin,
      read: false,
      createdAt: now
    };
    
    this.messages.set(id, message);
    return message;
  }
  
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  
  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messages.values())
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  
  async markMessageAsRead(id: number): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      message.read = true;
      this.messages.set(id, message);
    }
  }
}

// Export an instance of the storage
export const storage = new MemStorage();
