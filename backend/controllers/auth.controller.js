import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = signToken(admin._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/register (use only via Postman for initial setup)
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists.' });
    }

    const admin = await Admin.create({ username, password });
    const token = signToken(admin._id);

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me (protected)
export const getMe = async (req, res) => {
  res.status(200).json({
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      role: req.admin.role,
    },
  });
};
