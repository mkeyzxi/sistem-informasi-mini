// // File: backend/models/Course.js
// import mongoose from 'mongoose';

// const courseSchema = mongoose.Schema(
//   {
//     code: {
//       type: String,
//       required: [true, 'Kode mata kuliah tidak boleh kosong'],
//       unique: true,
//       trim: true,
//     },
//     name: {
//       type: String,
//       required: [true, 'Nama mata kuliah tidak boleh kosong'],
//       trim: true,
//     },
//     credits: {
//       type: Number,
//       required: [true, 'SKS tidak boleh kosong'],
//     },
//     lecturer: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: 'User', // Referensi ke model User (yang rolenya dosen)
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Course = mongoose.model('Course', courseSchema);
// export default Course;










import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // FIX: Tambahkan definisi untuk field 'students'
    // Ini harus berupa array dari ObjectId yang merujuk ke model 'User'.
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
