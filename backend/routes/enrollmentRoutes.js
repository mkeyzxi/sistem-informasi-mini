import express from 'express';
import {
  createEnrollment,
  getEnrollments,
  deleteEnrollment,
} from '../controllers/enrollmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createEnrollment)
  .get(protect, admin, getEnrollments);
  
router.route('/:id')
  .delete(protect, admin, deleteEnrollment);

export default router;