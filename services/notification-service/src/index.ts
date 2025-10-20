import express from 'express';
import rateLimit from 'express-rate-limit';
import { correlationIdMiddleware, authMiddleware, errorHandler } from '../../../utils';

const app = express();

// Middleware global
app.use(correlationIdMiddleware);
app.use(express.json());

// Rate limit
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests', code: 'RATE_LIMIT' },
});
app.use(limiter);

// Dummy notifications
const notifications = [
  { id: 'NOTIF-001', message: 'Order shipped', timestamp: '2025-01-15T10:00:00Z' },
  { id: 'NOTIF-002', message: 'Payment received', timestamp: '2025-01-15T09:30:00Z' },
];

// GET /notifications
app.get('/notifications', authMiddleware, (req, res) => {
  const limit = parseInt(req.query.limit?.toString() || '10', 10);
  const result = notifications.slice(0, limit);
  res.status(200).json({ notifications: result, total: result.length });
});

// Error handler
app.use(errorHandler);

export default app;