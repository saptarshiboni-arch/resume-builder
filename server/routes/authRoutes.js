import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'resume_builder_jwt_secret_key_2026',
    { expiresIn: '30d' }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, targetRole, careerLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide full name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }

    // Create user document
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      targetRole: targetRole || 'Software Developer',
      careerLevel: careerLevel || 'Entry Level',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        careerLevel: user.careerLevel,
        token,
      },
    });
  } catch (err) {
    console.error('Register route error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Server error during registration',
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        careerLevel: user.careerLevel,
        resumes: user.resumes,
        token,
      },
    });
  } catch (err) {
    console.error('Login route error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Server error during login',
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user profile
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch user profile',
    });
  }
});

/**
 * @route   POST /api/auth/save-resume
 * @desc    Save/update user resume
 * @access  Private
 */
router.post('/save-resume', protect, async (req, res) => {
  try {
    const { title, resumeData, template } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.resumes.unshift({
      title: title || 'My Resume',
      resumeData,
      template: template || 'modern',
      updatedAt: new Date(),
    });

    // Keep up to 10 latest resumes
    if (user.resumes.length > 10) {
      user.resumes = user.resumes.slice(0, 10);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      data: user.resumes,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to save resume',
    });
  }
});

export default router;
