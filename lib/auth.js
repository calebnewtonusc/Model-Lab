/**
 * JWT Authentication Middleware and Utilities
 * ModelLab authentication system
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'modellab-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// In-memory user store (replace with database in production)
const users = new Map();

// Initialize with a default admin user
const defaultAdmin = {
  id: 'user-admin-001',
  username: 'admin',
  email: 'admin@modellab.local',
  passwordHash: hashPassword('admin123'),
  role: 'admin',
  createdAt: new Date().toISOString(),
};
users.set(defaultAdmin.username, defaultAdmin);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + JWT_SECRET).digest('hex');
}

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * JWT Auth middleware - protects routes
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token required. Please login.',
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired. Please login again.',
      });
    }
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token. Please login.',
    });
  }
};

/**
 * Optional auth middleware - attaches user if token present, but doesn't block
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      req.user = verifyToken(token);
    } catch (e) {
      // ignore invalid token, continue as unauthenticated
    }
  }
  next();
};

/**
 * Register a new user
 */
function registerUser(username, email, password) {
  if (users.has(username)) {
    throw new Error('Username already exists');
  }

  // Check email uniqueness
  for (const [, user] of users) {
    if (user.email === email) {
      throw new Error('Email already registered');
    }
  }

  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    username,
    email,
    passwordHash: hashPassword(password),
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.set(username, newUser);
  return newUser;
}

/**
 * Authenticate user with credentials
 */
function authenticateUser(username, password) {
  const user = users.get(username);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  const hash = hashPassword(password);
  if (hash !== user.passwordHash) {
    throw new Error('Invalid username or password');
  }

  return user;
}

/**
 * Get user by ID
 */
function getUserById(id) {
  for (const [, user] of users) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
}

module.exports = {
  requireAuth,
  optionalAuth,
  generateToken,
  verifyToken,
  registerUser,
  authenticateUser,
  getUserById,
  hashPassword,
};
