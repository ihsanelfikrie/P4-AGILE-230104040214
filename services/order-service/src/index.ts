import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
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

// JSON error handler (harus setelah body parser)
app.use(jsonErrorHandler);

// Request logger
app.use(requestLogger);

// Rate limit
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100,
  message: { message: 'Too many requests', code: 'RATE_LIMIT' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Schema validasi Zod
const createOrderSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  quantity: z.number().int().min(1, 'quantity must be at least 1'),
});

// In-memory storage
const orders: any[] = [];

// Health check (tanpa auth)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service' });
});

// POST /orders
app.post('/orders', authMiddleware, (req, res) => {
  try {
    req.log?.info({ type: 'order_create_attempt', body: req.body });

    const validated = createOrderSchema.parse(req.body);

    const order = {
      id: `ORD-${Date.now()}`,
      productId: validated.productId,
      quantity: validated.quantity,
      status: 'created',
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    req.log?.info({
      type: 'order_created',
      orderId: order.id,
      productId: order.productId,
    });

    res.status(201).json(order);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      req.log?.warn({
        type: 'validation_error',
        errors: err.issues, // ✅ diperbaiki
      });
      return res.status(400).json({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: err.issues, // ✅ diperbaiki
      });
    }
    res.status(400).json({
      message: 'Bad request',
      code: 'BAD_REQUEST',
    });
  }
});

// Error handlers (harus paling akhir)
app.use(errorHandler);

export default app;
