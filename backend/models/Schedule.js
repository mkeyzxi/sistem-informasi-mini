// File: backend/models/Schedule.js
import mongoose from 'mongoose';

const scheduleSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    day: {
      type: String,
      required: true,
      enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    },
    time: {
      type: String, // Contoh: "08:00 - 10:00"
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;