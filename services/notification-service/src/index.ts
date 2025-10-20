import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {
  correlationIdMiddleware,
  requestLogger,
  authMiddleware,
  jsonErrorHandler,
  errorHandler,
  logger,
} from '../../../utils';

const app = express();

// Security headers
app.use(helmet());
app.use(cors());

// Correlation ID (harus paling awal)
app.use(correlationIdMiddleware);

// Body parser dengan limit
app.use(express.json({ limit: '1mb' }));

// JSON error handler
app.use(jsonErrorHandler);

// Request logger
app.use(requestLogger);

// Rate limit
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests', code: 'RATE_LIMIT' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Dummy notifications
const notifications = [
  { id: 'NOTIF-001', message: 'Order shipped', timestamp: '2025-01-15T10:00:00Z' },
  { id: 'NOTIF-002', message: 'Payment received', timestamp: '2025-01-15T09:30:00Z' },
  { id: 'NOTIF-003', message: 'Order delivered', timestamp: '2025-01-15T08:00:00Z' },
];

// Health check (tanpa auth)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

// GET /notifications
app.get('/notifications', authMiddleware, (req, res) => {
  const limit = parseInt(req.query.limit?.toString() || '10', 10);
  
  req.log?.info({ 
    type: 'notifications_fetch', 
    limit 
  });
  
  const result = notifications.slice(0, limit);
  
  res.status(200).json({ 
    notifications: result, 
    total: result.length 
  });
});

// Error handlers
app.use(errorHandler);

export default app;