/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user context to request
 */

const PUBLIC_ROUTES = new Set([
  '/health',
  '/api/v1/auth/signup',
  '/api/v1/auth/login'
]);

function isPublicEventRoute(req) {
  if (req.method === 'GET' && req.path === '/api/v1/events') {
    return true;
  }

  if (req.method === 'GET' && /^\/api\/v1\/events\/[^/]+$/.test(req.path)) {
    return true;
  }

  if (
    req.method === 'POST' &&
    /^\/api\/v1\/events\/[^/]+\/registrations$/.test(req.path)
  ) {
    return true;
  }

  return false;
}

export function authMiddleware(req, res, next) {
  if (PUBLIC_ROUTES.has(req.path) || isPublicEventRoute(req)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Missing or invalid authorization token'
    });
  }

  const token = authHeader.substring(7);
  const registry = req.app?.locals?.registry;
  const jwtAuthenticator = registry?.getAuthenticator('jwt');

  if (!jwtAuthenticator) {
    return res.status(500).json({
      success: false,
      error: 'Server Misconfiguration',
      message: 'JWT authenticator is not configured'
    });
  }

  try {
    const decoded = jwtAuthenticator.verify(token);

    req.user = {
      id: decoded.sub || decoded.id || null,
      email: decoded.email || null,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth verification failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
}

export default authMiddleware;
