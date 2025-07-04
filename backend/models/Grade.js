// // File: backend/models/Grade.js
// import mongoose from 'mongoose';

// const gradeSchema = mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: 'User',
//     },
//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: 'Course',
//     },
//     score: { // Nilai dalam bentuk huruf (A, B, C, D, E)
//       type: String,
//       required: true,
//       enum: ['A', 'B', 'C', 'D', 'E'],
//     },
//     semester: {
//       type: Number,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Grade = mongoose.model('Grade', gradeSchema);
// export default Grade;




import mongoose from 'mongoose';

const gradeSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    score: { // Nilai dalam bentuk huruf (A, B, C, D, E)
      type: String,
      required: true,
      enum: ['A', 'B', 'C', 'D', 'E'],
    },
    // FIX: Field 'semester' telah dihapus dari skema
  },
  {
    timestamps: true,
  }
);

const Grade = mongoose.model('Grade', gradeSchema);
export default Grade;
