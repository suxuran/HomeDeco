import express from "express";
import cors from "cors";

// Route handlers
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleRegister,
  handleValidateToken,
  authenticateToken,
  requireAdmin,
} from "./routes/auth";
import {
  handleGetStats,
  handleGetUsers,
  handleGetProducts,
  handleGetTestimonies,
  handleApproveTestimony,
  handleDeleteTestimony,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from "./routes/admin";
import {
  handleGetUserOrders,
  handleGetUserTestimonies,
  handleCreateTestimony,
  handleDeleteUserTestimony,
} from "./routes/user";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Home-Deco API is running!" });
  });

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);
  app.get("/api/auth/validate", handleValidateToken);

  // Admin routes (protected)
  app.get("/api/admin/stats", authenticateToken, requireAdmin, handleGetStats);
  app.get("/api/admin/users", authenticateToken, requireAdmin, handleGetUsers);
  app.post(
    "/api/admin/users",
    authenticateToken,
    requireAdmin,
    handleCreateUser,
  );
  app.put(
    "/api/admin/users/:id",
    authenticateToken,
    requireAdmin,
    handleUpdateUser,
  );
  app.delete(
    "/api/admin/users/:id",
    authenticateToken,
    requireAdmin,
    handleDeleteUser,
  );
  app.get(
    "/api/admin/products",
    authenticateToken,
    requireAdmin,
    handleGetProducts,
  );
  app.get(
    "/api/admin/testimonies",
    authenticateToken,
    requireAdmin,
    handleGetTestimonies,
  );
  app.patch(
    "/api/admin/testimonies/:id/approve",
    authenticateToken,
    requireAdmin,
    handleApproveTestimony,
  );
  app.delete(
    "/api/admin/testimonies/:id",
    authenticateToken,
    requireAdmin,
    handleDeleteTestimony,
  );

  // User routes (protected)
  app.get("/api/user/orders", authenticateToken, handleGetUserOrders);
  app.get("/api/user/testimonies", authenticateToken, handleGetUserTestimonies);
  app.post("/api/user/testimonies", authenticateToken, handleCreateTestimony);
  app.delete(
    "/api/user/testimonies/:id",
    authenticateToken,
    handleDeleteUserTestimony,
  );

  return app;
}
