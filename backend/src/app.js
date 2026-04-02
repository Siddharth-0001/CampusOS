/**
 * Express App Configuration
 * Sets up middleware in correct order and mounts routes
 */

import express from 'express';
import cors from 'cors';
import { loggerMiddleware } from './middleware/logger.js';
import { authMiddleware } from './middleware/auth.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.js';
import { loadPlugins } from './plugin-loader.js';

export async function createApp(registry) {
  const app = express();

  // Environment config
  const isDev = process.env.NODE_ENV !== 'production';

  // ============== MIDDLEWARE CHAIN (Order matters!) ==============

  // 1. Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // 2. CORS - Allow cross-origin requests from frontend
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));

  // 3. Logging - Log all requests
  app.use(loggerMiddleware);

  // 4. Health check endpoint (no auth required)
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  });

  // 5. Authentication - Verify JWT before protected routes
  app.use(authMiddleware);

  // ============== PLUGIN LOADING ==============
  // Load all modules from /apps/ and let them register routes
  try {
    await loadPlugins(app, registry);
  } catch (error) {
    console.error('Plugin loading failed:', error.message);
    if (!isDev) throw error; // Fail hard in production
  }

  // ============== ERROR HANDLING (Must be last!) ==============
  // 404 handler - for routes that don't exist
  app.use(notFoundMiddleware);

  // Error handler - catches all errors
  app.use(errorMiddleware);

  return app;
}

export default createApp;
