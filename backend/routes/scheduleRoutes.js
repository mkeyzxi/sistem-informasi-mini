import express from 'express';
import {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByLecturer
} from '../controllers/scheduleController.js';
import { protect, admin, dosen } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getSchedules)
  .post(protect, admin, createSchedule);

// Rute spesifik harus di atas rute dinamis seperti /:id
router.route('/lecturer/:lecturerId').get(protect, dosen, getSchedulesByLecturer);

router.route('/:id')
  .get(protect, getScheduleById)
  .put(protect, admin, updateSchedule)
  .delete(protect, admin, deleteSchedule);

export default router;