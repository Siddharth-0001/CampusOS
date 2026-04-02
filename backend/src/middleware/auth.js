/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user context to request
 */

export function authMiddleware(req, res, next) {
  // Skip auth for public routes
  const publicRoutes = ['/api/auth/signup', '/api/auth/login', '/health'];
  
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Extract token from Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Missing or invalid authorization token'
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    // TODO: Verify JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded; // Attach user info to request

    // For now, mock user context
    req.user = {
      id: 'mock-user-id',
      email: 'user@example.com',
      role: 'user'
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
