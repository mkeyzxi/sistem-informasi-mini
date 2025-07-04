// File: backend/routes/gradeRoutes.js
import express from 'express';
import {
  addGrade,
  getGrades,
  updateGrade,
  deleteGrade,
  getTranscript,
  getGradesByCourse,
} from '../controllers/gradeController.js';
import { protect, admin, dosen, mahasiswa } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, dosen, getGrades) // Dosen & Admin
  .post(protect, dosen, addGrade); // Dosen & Admin bisa input

// Rute spesifik
router.get('/transcript/:studentId', protect, getTranscript); // Mahasiswa ybs & Admin
router.get('/course/:courseId', protect, dosen, getGradesByCourse); // Dosen & Admin

router.route('/:id')
  .put(protect, dosen, updateGrade) // Dosen & Admin
  .delete(protect, admin, deleteGrade); // Hanya Admin

export default router;