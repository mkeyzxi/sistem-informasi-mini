// // File: backend/routes/gradeRoutes.js
// import express from 'express';
// import {
//   addGrade,
//   getGrades,
//   updateGrade,
//   deleteGrade,
//   getTranscript,
//   getGradesByCourse,
// } from '../controllers/gradeController.js';
// import { protect, admin, dosen, mahasiswa } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.route('/')
//   .get(protect, dosen, getGrades) // Dosen & Admin
//   .post(protect, dosen, addGrade); // Dosen & Admin bisa input

// // Rute spesifik
// router.get('/transcript/:studentId', protect, getTranscript); // Mahasiswa ybs & Admin
// router.get('/course/:courseId', protect, dosen, getGradesByCourse); // Dosen & Admin

// router.route('/:id')
//   .put(protect, dosen, updateGrade) // Dosen & Admin
//   .delete(protect, admin, deleteGrade); // Hanya Admin

// export default router;




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
