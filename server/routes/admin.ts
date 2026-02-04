import { RequestHandler } from "express";
import {
  DashboardStats,
  Product,
  Testimony,
  User,
  ApiResponse,
} from "@shared/types";

// Mock data - In a real app, this would come from a database
let mockUsers: User[] = [
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
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
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

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Modern Living Room Set",
    description:
      "Contemporary 3-piece sofa set with clean lines and premium fabric upholstery. Perfect for modern living spaces.",
    price: 1299.99,
    category: "Furniture",
    images: [
      "https://images.pexels.com/photos/279607/pexels-photo-279607.jpeg",
    ],
    inStock: true,
    featured: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Wooden Dining Table",
    description:
      "Elegant dining table crafted from solid wood, seats 6 people comfortably. Timeless design that complements any dining room.",
    price: 899.99,
    category: "Furniture",
    images: [
      "https://images.pexels.com/photos/32805984/pexels-photo-32805984.jpeg",
    ],
    inStock: true,
    featured: true,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Decorative Plant Shelves",
    description:
      "Stylish wooden shelving unit perfect for displaying plants, books, and decorative items.",
    price: 249.99,
    category: "Storage",
    images: [
      "https://images.pexels.com/photos/32178067/pexels-photo-32178067.png",
    ],
    inStock: true,
    featured: false,
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Modern Table Lamp",
    description: "Sleek contemporary table lamp with adjustable brightness.",
    price: 89.99,
    category: "Lighting",
    images: [
      "https://images.pexels.com/photos/32791474/pexels-photo-32791474.jpeg",
    ],
    inStock: true,
    featured: false,
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-04T00:00:00.000Z",
  },
];

let mockTestimonies: Testimony[] = [
  {
    id: "1",
    userId: "2",
    user: { name: "Demo User", avatar: "DU" },
    content:
      "Amazing service! They transformed our living room into something incredible.",
    rating: 5,
    approved: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    userId: "3",
    user: { name: "Jane Smith", avatar: "JS" },
    content: "Professional team, great attention to detail. Highly recommend!",
    rating: 5,
    approved: false,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
];

export const handleGetStats: RequestHandler = (req, res) => {
  try {
    const stats: DashboardStats = {
      totalUsers: mockUsers.filter((u) => u.role === "user").length,
      totalProducts: mockProducts.length,
      totalOrders: 23, // Mock data
      totalRevenue: 45690, // Mock data
      pendingTestimonies: mockTestimonies.filter((t) => !t.approved).length,
    };

    res.json({
      success: true,
      data: stats,
    } as ApiResponse<DashboardStats>);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleGetUsers: RequestHandler = (req, res) => {
  try {
    res.json({
      success: true,
      data: mockUsers,
    } as ApiResponse<User[]>);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleGetProducts: RequestHandler = (req, res) => {
  try {
    res.json({
      success: true,
      data: mockProducts,
    } as ApiResponse<Product[]>);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleGetTestimonies: RequestHandler = (req, res) => {
  try {
    res.json({
      success: true,
      data: mockTestimonies,
    } as ApiResponse<Testimony[]>);
  } catch (error) {
    console.error("Get testimonies error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleApproveTestimony: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const testimony = mockTestimonies.find((t) => t.id === id);
    if (!testimony) {
      return res.status(404).json({
        success: false,
        message: "Testimony not found",
      } as ApiResponse);
    }

    testimony.approved = true;
    testimony.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: testimony,
      message: "Testimony approved successfully",
    } as ApiResponse<Testimony>);
  } catch (error) {
    console.error("Approve testimony error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleDeleteTestimony: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const index = mockTestimonies.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Testimony not found",
      } as ApiResponse);
    }

    mockTestimonies.splice(index, 1);

    res.json({
      success: true,
      message: "Testimony deleted successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("Delete testimony error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

// User CRUD operations
export const handleCreateUser: RequestHandler = (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      } as ApiResponse);
    }

    // Check if user already exists
    if (mockUsers.find((u) => u.email === email)) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      } as ApiResponse);
    }

    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email,
      name,
      role: role || "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    res.status(201).json({
      success: true,
      data: newUser,
      message: "User created successfully",
    } as ApiResponse<User>);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleUpdateUser: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as ApiResponse);
    }

    // Check if email is already taken by another user
    if (email && mockUsers.find((u) => u.email === email && u.id !== id)) {
      return res.status(409).json({
        success: false,
        message: "Email already taken by another user",
      } as ApiResponse);
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      updatedAt: new Date().toISOString(),
    };

    mockUsers[userIndex] = updatedUser;

    res.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    } as ApiResponse<User>);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleDeleteUser: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user as User;

    // Prevent admin from deleting themselves
    if (currentUser.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      } as ApiResponse);
    }

    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as ApiResponse);
    }

    const deletedUser = mockUsers[userIndex];
    mockUsers.splice(userIndex, 1);

    res.json({
      success: true,
      message: `User ${deletedUser.name} deleted successfully`,
    } as ApiResponse);
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};
