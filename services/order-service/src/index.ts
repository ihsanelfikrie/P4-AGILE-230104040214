import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { correlationIdMiddleware, authMiddleware, errorHandler } from '../../../utils';

const app = express();

// Middleware global
app.use(correlationIdMiddleware);
app.use(express.json());

// Rate limit
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100,
  message: { message: 'Too many requests', code: 'RATE_LIMIT' },
});
app.use(limiter);

// Schema validasi Zod
const createOrderSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  quantity: z.number().int().min(1, 'quantity must be at least 1'),
});

// In-memory storage
const orders: any[] = [];

// POST /orders
app.post('/orders', authMiddleware, (req, res) => {
  try {
    const validated = createOrderSchema.parse(req.body);
    const order = {
      id: `ORD-${Date.now()}`,
      productId: validated.productId,
      quantity: validated.quantity,
      status: 'created',
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    res.status(201).json(order);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: err.issues, // ✅ diperbaiki
      });
    }
    res.status(400).json({ message: 'Bad request', code: 'BAD_REQUEST' });
  }
});

// Error handler
app.use(errorHandler);

export default app;
