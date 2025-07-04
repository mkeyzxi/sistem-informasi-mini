// File: backend/controllers/userController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all users (with filter and search)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const query = {};

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { lecturerId: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query).select('-password');
  res.json(users);
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Create a new user (by Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
    // Logic mirip register, tapi dilakukan oleh admin
    const { name, email, password, role, studentId, lecturerId } = req.body;

    if (!name || !email || !password || !role) {
        res.status(400);
        throw new Error('Harap isi semua field yang wajib');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User dengan email ini sudah ada');
    }

    const user = new User({
        name,
        email,
        password,
        role,
        studentId: role === 'mahasiswa' ? studentId : undefined,
        lecturerId: role === 'dosen' ? lecturerId : undefined,
    });

    const createdUser = await user.save();
    
    await AuditLog.create({
        user: req.user._id, // Admin yang melakukan aksi
        action: 'CREATE_USER',
        entity: 'User',
        entityId: createdUser._id,
        after: createdUser.toObject(),
        ipAddress: req.ip,
    });

    res.status(201).json(createdUser);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const beforeState = user.toObject();
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    if (req.body.password) {
      user.password = req.body.password;
    }
     if (user.role === 'mahasiswa') {
        user.studentId = req.body.studentId || user.studentId;
        user.lecturerId = undefined;
    } else if (user.role === 'dosen') {
        user.lecturerId = req.body.lecturerId || user.lecturerId;
        user.studentId = undefined;
    } else {
        user.studentId = undefined;
        user.lecturerId = undefined;
    }


    const updatedUser = await user.save();
    
    await AuditLog.create({
        user: req.user._id,
        action: 'UPDATE_USER',
        entity: 'User',
        entityId: updatedUser._id,
        before: beforeState,
        after: updatedUser.toObject(),
        ipAddress: req.ip
    });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const beforeState = user.toObject();
    await user.deleteOne();
    
    await AuditLog.create({
        user: req.user._id,
        action: 'DELETE_USER',
        entity: 'User',
        entityId: user._id,
        before: beforeState,
        ipAddress: req.ip
    });
    
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { getUsers, getUserById, createUser, updateUser, deleteUser };