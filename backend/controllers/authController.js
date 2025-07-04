// File: backend/controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, studentId, lecturerId } = req.body;

  // Validasi dasar
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Harap isi semua field yang wajib');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User dengan email ini sudah terdaftar');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    studentId: role === 'mahasiswa' ? studentId : undefined,
    lecturerId: role === 'dosen' ? lecturerId : undefined,
  });

  if (user) {
    const token = generateToken(user._id, user.role);

    await AuditLog.create({
        user: user._id,
        action: 'REGISTER_USER',
        entity: 'User',
        entityId: user._id,
        after: user.toObject(),
        ipAddress: req.ip
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id, user.role);
    
    await AuditLog.create({
        user: user._id,
        action: 'LOGIN_USER',
        entity: 'User',
        entityId: user._id,
        ipAddress: req.ip
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user didapat dari middleware 'protect'
  res.status(200).json(req.user);
});

export { registerUser, loginUser, getMe };