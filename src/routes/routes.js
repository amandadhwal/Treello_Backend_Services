import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { addMember, createTeam, getMembers } from "../controllers/team.controller.js";
import { addComment, createTask, deleteTask, updateTask, updateStatus } from "../controllers/task.controller.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";
const router = Router();

// Auth
router.post("/auth/register", register);
router.post("/auth/login",loginLimiter, login);

// Teams
router.post("/teams", auth, createTeam);
router.post("/teams/:teamId/add-member", auth, addMember);
router.get("/teams/:teamId/members", auth, getMembers);

// Tasks
router.post("/teams/:teamId/task", auth, createTask);
router.patch("/teams/:teamId/tasks/:taskId", auth, updateTask);
router.delete("/teams/:teamId/tasks/:taskId", auth, deleteTask);

// Task Status
router.patch("/teams/:teamId/tasks/:taskId/status", auth, updateStatus);

// Comments
router.post("/teams/:teamId/tasks/:taskId/comments", auth, addComment);

export default router;
