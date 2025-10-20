import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// Extend Express Request untuk correlation-id
declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

// Middleware: Generate correlation-id
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = req.headers['x-correlation-id']?.toString() || randomUUID();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
}

// Middleware: Auth Bearer (dummy)
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
  }
  const token = auth.substring(7);
  if (token !== 'test123') {
    return res.status(401).json({ message: 'Invalid token', code: 'UNAUTHORIZED' });
  }
  next();
}

// Error handler
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
}