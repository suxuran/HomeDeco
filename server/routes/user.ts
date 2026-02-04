import { RequestHandler } from "express";
import { Order, Testimony, User, ApiResponse } from "@shared/types";

// Mock data - In a real app, this would come from a database
const mockOrders: Order[] = [];

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
];

export const handleGetUserOrders: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    const userOrders = mockOrders.filter((order) => order.userId === user.id);

    res.json({
      success: true,
      data: userOrders,
    } as ApiResponse<Order[]>);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleGetUserTestimonies: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    const userTestimonies = mockTestimonies.filter(
      (testimony) => testimony.userId === user.id,
    );

    res.json({
      success: true,
      data: userTestimonies,
    } as ApiResponse<Testimony[]>);
  } catch (error) {
    console.error("Get user testimonies error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleCreateTestimony: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    const { content, rating } = req.body;

    if (!content || !rating) {
      return res.status(400).json({
        success: false,
        message: "Content and rating are required",
      } as ApiResponse);
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      } as ApiResponse);
    }

    const newTestimony: Testimony = {
      id: (mockTestimonies.length + 1).toString(),
      userId: user.id,
      user: { name: user.name, avatar: user.avatar },
      content,
      rating,
      approved: false, // New testimonies need approval
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTestimonies.push(newTestimony);

    res.status(201).json({
      success: true,
      data: newTestimony,
      message: "Testimony created successfully",
    } as ApiResponse<Testimony>);
  } catch (error) {
    console.error("Create testimony error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

export const handleDeleteUserTestimony: RequestHandler = (req, res) => {
  try {
    const user = (req as any).user as User;
    const { id } = req.params;

    const index = mockTestimonies.findIndex(
      (t) => t.id === id && t.userId === user.id,
    );
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message:
          "Testimony not found or you don't have permission to delete it",
      } as ApiResponse);
    }

    mockTestimonies.splice(index, 1);

    res.json({
      success: true,
      message: "Testimony deleted successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("Delete user testimony error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};
