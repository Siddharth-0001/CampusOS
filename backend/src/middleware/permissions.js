const VALID_ROLES = new Set(['admin', 'coordinator', 'volunteer']);

export function isValidRole(role) {
  return VALID_ROLES.has(role);
}

export function requireRoles(...allowedRoles) {
  const allowed = new Set(allowedRoles);

  return function roleGuard(req, res, next) {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User context missing'
      });
    }

    if (!allowed.has(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
}

export default requireRoles;
