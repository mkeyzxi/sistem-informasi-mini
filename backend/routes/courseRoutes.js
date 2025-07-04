// import express from 'express';

// import {
//   getCourses,
//   getCourseById,
//   createCourse,
//   updateCourse,
//   deleteCourse,
//   getEnrolledStudents,
// } from '../controllers/courseController.js';
// import { protect, admin, dosen } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.route('/')
//   .get(protect, getCourses)
//   .post(protect, admin, createCourse);

// // --- ROUTE BARU YANG DITAMBAHKAN ---
// router.route('/:id/students').get(protect, dosen, getEnrolledStudents);

// router.route('/:id')
//   .get(protect, getCourseById)
//   .put(protect, admin, updateCourse)
//   .delete(protect, admin, deleteCourse);

// export default router;






import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudents, // Ditambahkan dari potongan kode pertama
  getEnrolledStudents,
} from '../controllers/courseController.js';
import { protect, admin, dosen } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCourses)
  .post(protect, admin, createCourse);

// Rute untuk mendaftarkan mahasiswa ke mata kuliah
router.route('/:id/enroll').post(protect, admin, enrollStudents);

// Rute untuk mendapatkan mahasiswa yang terdaftar di mata kuliah
router.route('/:id/students').get(protect, dosen, getEnrolledStudents);

router.route('/:id')
  .get(protect, getCourseById)
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

export default router;