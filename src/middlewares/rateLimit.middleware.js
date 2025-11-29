import rateLimit from "express-rate-limit";

// login limiter
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
  message: { message: "Too many login attempts, try again later" }
});
