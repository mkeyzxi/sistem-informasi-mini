import express from 'express';
import {
  addGrade,
  updateGrade,
  getGradesByCourse,
  getTranscript,
} from '../controllers/gradeController.js';
import { protect, admin, dosen } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rute untuk dosen menambahkan nilai baru
router.route('/').post(protect, dosen, addGrade);

// Rute untuk dosen mengupdate nilai
router.route('/:id').put(protect, dosen, updateGrade);

// Rute untuk dosen melihat nilai per mata kuliah
router.route('/course/:courseId').get(protect, dosen, getGradesByCourse);

// Rute untuk mahasiswa melihat transkrip
router.route('/transcript/:studentId').get(protect, getTranscript);

export default router;
