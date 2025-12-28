const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'name', 'role', 'branchId', 'customerId', 'allowedIPs', 'createdAt']
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user.toJSON();
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied: Insufficient permissions',
        requiredRole: roles,
        userRole: req.user.role 
      });
    }

    next();
  };
};

// IP Restriction Middleware
const checkIP = (req, res, next) => {
  if (!req.user || !req.user.allowedIPs) return next();
  
  const clientIP = req.ip || req.connection.remoteAddress;
  const allowed = req.user.allowedIPs.split(',').map(ip => ip.trim());
  
  const match = allowed.some(ip => clientIP.includes(ip));
  
  if (!match) {
    return res.status(403).json({ error: `Access denied from IP: ${clientIP}` });
  }
  next();
};

module.exports = { authMiddleware, checkRole, checkIP };
