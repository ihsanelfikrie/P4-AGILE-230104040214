import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import pino from 'pino';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      log?: pino.Logger;
    }
  }
}

// Logger dengan redaction (sembunyikan data sensitif)
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'Authorization'],
    censor: '[REDACTED]',
  },
  serializers: {
    req: (req: any) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
      correlationId: req.correlationId,
    }),
    res: (res: any) => ({
      statusCode: res.statusCode,
      correlationId: res.getHeader?.('x-correlation-id'),
    }),
  },
});

// Middleware: Correlation ID
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = req.headers['x-correlation-id']?.toString() || randomUUID();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  
  // Attach logger dengan context
  req.log = logger.child({ correlationId });
  
  next();
}

// Middleware: Request Logger
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    req.log?.info({
      type: 'http_request',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      correlationId: req.correlationId,
    });
  });
  
  next();
}

// Middleware: Auth Bearer (dummy)
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Bearer ')) {
    req.log?.warn({ type: 'auth_failed', reason: 'missing_token' });
    return res.status(401).json({ 
      message: 'Unauthorized', 
      code: 'UNAUTHORIZED' 
    });
  }
  
  const token = auth.substring(7);
  if (token !== 'test123') {
    req.log?.warn({ type: 'auth_failed', reason: 'invalid_token' });
    return res.status(401).json({ 
      message: 'Invalid token', 
      code: 'UNAUTHORIZED' 
    });
  }
  
  next();
}

// Error handler untuk JSON rusak
export function jsonErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof SyntaxError && 'body' in err) {
    req.log?.error({ type: 'json_parse_error', error: err.message });
    return res.status(400).json({ 
      message: 'Invalid JSON', 
      code: 'BAD_JSON' 
    });
  }
  next(err);
}

// Error handler umum
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  req.log?.error({ type: 'internal_error', error: err.message, stack: err.stack });
  res.status(500).json({ 
    message: 'Internal server error', 
    code: 'INTERNAL_ERROR' 
  });
}