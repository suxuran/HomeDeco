import { RequestHandler } from "express";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@shared/types";

// Mock database - In a real app, this would be a proper database
const users: User[] = [
  {
    id: "1",
    email: "admin@homedeco.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    email: "user@homedeco.com",
    name: "Demo User",
    role: "user",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    email: "jane.smith@email.com",
    name: "Jane Smith",
    role: "user",
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
  },
  {
    id: "4",
    email: "michael.chen@email.com",
    name: "Michael Chen",
    role: "user",
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-04T00:00:00.000Z",
  },
  {
    id: "5",
    email: "sarah.johnson@email.com",
    name: "Sarah Johnson",
    role: "user",
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-05T00:00:00.000Z",
  },
  {
    id: "6",
    email: "david.wilson@email.com",
    name: "David Wilson",
    role: "user",
    createdAt: "2024-01-06T00:00:00.000Z",
    updatedAt: "2024-01-06T00:00:00.000Z",
  },
];

// Mock password storage (In a real app, use proper password hashing)
const passwords: Record<string, string> = {
  "admin@homedeco.com": "admin123",
  "user@homedeco.com": "user123",
  "jane.smith@email.com": "password123",
  "michael.chen@email.com": "password123",
  "sarah.johnson@email.com": "password123",
  "david.wilson@email.com": "password123",
};

// Simple JWT-like token generator (In a real app, use proper JWT)
const generateToken = (userId: string): string => {
  return Buffer.from(
    JSON.stringify({ userId, timestamp: Date.now() }),
  ).toString("base64");
};

const parseToken = (token: string): { userId: string } | null => {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    return { userId: decoded.userId };
  } catch {
    return null;
  }
};

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      } as AuthResponse);
    }

    const user = users.find((u) => u.email === email);
    const storedPassword = passwords[email];

    if (!user || storedPassword !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      user,
      token,
      message: "Login successful",
    } as AuthResponse);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { name, email, password }: RegisterRequest = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      } as AuthResponse);
    }

    if (users.find((u) => u.email === email)) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      } as AuthResponse);
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      } as AuthResponse);
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      email,
      name,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    passwords[email] = password;

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      user: newUser,
      token,
      message: "Registration successful",
    } as AuthResponse);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};

export const handleValidateToken: RequestHandler = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token required",
      } as AuthResponse);
    }

    const decoded = parseToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      } as AuthResponse);
    }

    const user = users.find((u) => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      } as AuthResponse);
    }

    res.json({
      success: true,
      user,
      message: "Token valid",
    } as AuthResponse);
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};

// Middleware to authenticate requests
export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  const decoded = parseToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }

  const user = users.find((u) => u.id === decoded.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  // Add user to request object
  (req as any).user = user;
  next();
};

// Middleware to check admin role
export const requireAdmin: RequestHandler = (req, res, next) => {
  const user = (req as any).user as User;

  if (user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};
