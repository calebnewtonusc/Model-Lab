/**
 * Authentication Routes
 * Login, register, and token management
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { registerUser, authenticateUser, generateToken, requireAuth } = require('../lib/auth');

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', (req, res) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid registration data',
      details: error.details.map(d => ({ field: d.path.join('.'), message: d.message })),
    });
  }

  try {
    const user = registerUser(value.username, value.email, value.password);
    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(409).json({
      error: 'Conflict',
      message: err.message,
    });
  }
});

/**
 * POST /api/auth/login
 * Login with username and password
 */
router.post('/login', (req, res) => {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Username and password are required',
    });
  }

  try {
    const user = authenticateUser(value.username, value.password);
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // Return generic error to prevent user enumeration
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid username or password',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info (requires auth)
 */
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

/**
 * POST /api/auth/logout
 * Logout (client should discard token)
 */
router.post('/logout', requireAuth, (req, res) => {
  // JWT is stateless - client discards token
  // In production, maintain a token blacklist
  res.json({ message: 'Logged out successfully' });
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', requireAuth, (req, res) => {
  const { getUserById, generateToken: genToken } = require('../lib/auth');
  const user = getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newToken = genToken(user);
  res.json({
    message: 'Token refreshed',
    token: newToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = router;
