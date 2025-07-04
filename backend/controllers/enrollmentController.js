
import asyncHandler from 'express-async-handler';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Mendaftarkan mahasiswa ke mata kuliah
// @route   POST /api/enrollments
// @access  Private/Admin
const createEnrollment = asyncHandler(async (req, res) => {
  const { studentId, courseId, semester } = req.body;

  if (!studentId || !courseId || !semester) {
    res.status(400);
    throw new Error('Harap sediakan ID mahasiswa, ID mata kuliah, dan semester.');
  }

  const student = await User.findById(studentId);
  const course = await Course.findById(courseId);

  if (!student || student.role !== 'mahasiswa') {
    res.status(404);
    throw new Error('Mahasiswa tidak ditemukan.');
  }
  if (!course) {
    res.status(404);
    throw new Error('Mata kuliah tidak ditemukan.');
  }

  const enrollmentExists = await Enrollment.findOne({ student: studentId, course: courseId });

  if (enrollmentExists) {
    res.status(400);
    throw new Error('Mahasiswa sudah terdaftar di mata kuliah ini.');
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    semester,
  });
  
  await AuditLog.create({
      user: req.user._id,
      action: 'CREATE_ENROLLMENT',
      entity: 'Enrollment',
      entityId: enrollment._id,
      after: enrollment.toObject(),
      ipAddress: req.ip,
  });

  res.status(201).json(enrollment);
});

// @desc    Mendapatkan semua data pendaftaran
// @route   GET /api/enrollments
// @access  Private/Admin
const getEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({})
        .populate('student', 'name studentId')
        .populate('course', 'name code');
    res.json(enrollments);
});


// @desc    Menghapus pendaftaran
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
const deleteEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (enrollment) {
    const beforeState = enrollment.toObject();
    await enrollment.deleteOne();

    await AuditLog.create({
        user: req.user._id,
        action: 'DELETE_ENROLLMENT',
        entity: 'Enrollment',
        entityId: enrollment._id,
        before: beforeState,
        ipAddress: req.ip,
    });

    res.json({ message: 'Pendaftaran berhasil dihapus.' });
  } else {
    res.status(404);
    throw new Error('Data pendaftaran tidak ditemukan.');
  }
});

export { createEnrollment, getEnrollments, deleteEnrollment };

