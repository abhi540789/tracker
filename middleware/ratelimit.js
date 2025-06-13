// middlewares/rateLimit.js
import rateLimit from 'express-rate-limit';

export const helloLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: {
    status: 429,
    error: 'Too many requests. Please try again after a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
