// // File: backend/controllers/gradeController.js
// import asyncHandler from 'express-async-handler';
// import mongoose from 'mongoose';
// import Grade from '../models/Grade.js';
// import AuditLog from '../models/AuditLog.js';

// // @desc    Add a new grade
// // @route   POST /api/grades
// // @access  Private/Dosen
// const addGrade = asyncHandler(async (req, res) => {
//   const { student, course, score, semester } = req.body;

//   // Cek apakah nilai sudah ada
//   const gradeExists = await Grade.findOne({ student, course, semester });
//   if (gradeExists) {
//       res.status(400);
//       throw new Error('Grade for this student in this course and semester already exists');
//   }

//   const grade = new Grade({
//     student,
//     course,
//     score,
//     semester,
//   });

//   const createdGrade = await grade.save();
  
//   await AuditLog.create({
//       user: req.user._id, // Dosen yang input nilai
//       action: 'CREATE_GRADE',
//       entity: 'Grade',
//       entityId: createdGrade._id,
//       after: createdGrade.toObject(),
//       ipAddress: req.ip,
//   });

//   res.status(201).json(createdGrade);
// });

// // @desc    Get all grades (for admin/dosen)
// // @route   GET /api/grades
// // @access  Private/Dosen
// const getGrades = asyncHandler(async (req, res) => {
//     const { student, course, semester, search } = req.query;
//     let query = {};

//     // Dosen hanya bisa melihat nilai yang berhubungan dengan mata kuliahnya
//     if (req.user.role === 'dosen') {
//         const lecturerCourses = await mongoose.model('Course').find({ lecturer: req.user._id }).select('_id');
//         const courseIds = lecturerCourses.map(c => c._id);
//         query.course = { $in: courseIds };
//     }
    
//     if (student) query.student = student;
//     if (course) query.course = course;
//     if (semester) query.semester = semester;

//     const grades = await Grade.find(query)
//       .populate('student', 'name studentId')
//       .populate('course', 'name code');
      
//     res.json(grades);
// });

// // @desc    Update a grade
// // @route   PUT /api/grades/:id
// // @access  Private/Dosen
// const updateGrade = asyncHandler(async (req, res) => {
//     const grade = await Grade.findById(req.params.id);

//     if (grade) {
//         const beforeState = grade.toObject();

//         grade.score = req.body.score || grade.score;
//         grade.semester = req.body.semester || grade.semester;

//         const updatedGrade = await grade.save();
        
//         await AuditLog.create({
//             user: req.user._id,
//             action: 'UPDATE_GRADE',
//             entity: 'Grade',
//             entityId: updatedGrade._id,
//             before: beforeState,
//             after: updatedGrade.toObject(),
//             ipAddress: req.ip,
//         });

//         res.json(updatedGrade);
//     } else {
//         res.status(404);
//         throw new Error('Grade not found');
//     }
// });

// // @desc    Delete a grade
// // @route   DELETE /api/grades/:id
// // @access  Private/Admin
// const deleteGrade = asyncHandler(async (req, res) => {
//     const grade = await Grade.findById(req.params.id);

//     if (grade) {
//         const beforeState = grade.toObject();
//         await grade.deleteOne();

//         await AuditLog.create({
//             user: req.user._id,
//             action: 'DELETE_GRADE',
//             entity: 'Grade',
//             entityId: grade._id,
//             before: beforeState,
//             ipAddress: req.ip,
//         });

//         res.json({ message: 'Grade removed' });
//     } else {
//         res.status(404);
//         throw new Error('Grade not found');
//     }
// });

// // @desc    Get transcript for a student and calculate GPA (IPK)
// // @route   GET /api/grades/transcript/:studentId
// // @access  Private
// const getTranscript = asyncHandler(async (req, res) => {
//     const studentId = req.params.studentId;

//     // Hanya admin atau mahasiswa yang bersangkutan yang bisa melihat transkrip
//     if (req.user.role !== 'admin' && req.user._id.toString() !== studentId) {
//         res.status(403);
//         throw new Error('User not authorized to view this transcript');
//     }

//     const grades = await Grade.find({ student: studentId })
//         .populate('course', 'name credits');

//     const gradePoints = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'E': 0 };
//     let totalCredits = 0;
//     let totalWeightedPoints = 0;

//     const transcript = grades.map(g => {
//         const credits = g.course.credits;
//         const point = gradePoints[g.score];
//         const weightedPoint = credits * point;
        
//         totalCredits += credits;
//         totalWeightedPoints += weightedPoint;

//         return {
//             courseCode: g.course.code,
//             courseName: g.course.name,
//             credits: g.course.credits,
//             score: g.score,
//             semester: g.semester
//         };
//     });

//     const gpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : 0;

//     res.json({
//         transcript,
//         totalCredits,
//         gpa // IPK (Indeks Prestasi Kumulatif)
//     });
// });

// // @desc    Get student grades for a specific course (for lecturers)
// // @route   GET /api/grades/course/:courseId
// // @access  Private/Dosen
// const getGradesByCourse = asyncHandler(async (req, res) => {
//     const { courseId } = req.params;
//     const grades = await Grade.find({ course: courseId }).populate('student', 'name studentId');
//     res.json(grades);
// });


// export { addGrade, getGrades, updateGrade, deleteGrade, getTranscript, getGradesByCourse };












import asyncHandler from 'express-async-handler';
import Grade from '../models/Grade.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

// @desc    Menambahkan atau membuat nilai baru
// @route   POST /api/grades
// @access  Private/Dosen
const addGrade = asyncHandler(async (req, res) => {
  const { student: studentIdentifier, course: courseId, score } = req.body;

  // Cari mahasiswa berdasarkan NIM (studentId)
  const student = await User.findOne({ studentId: studentIdentifier });
  if (!student) {
    res.status(404);
    throw new Error('Mahasiswa dengan NIM tersebut tidak ditemukan');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Mata kuliah tidak ditemukan');
  }

  // Cek apakah mahasiswa terdaftar di mata kuliah
  const isEnrolled = course.students.some(id => id.equals(student._id));
  if (!isEnrolled) {
    res.status(400);
    throw new Error('Mahasiswa tidak terdaftar pada mata kuliah ini');
  }

  // Cek apakah nilai sudah ada
  const gradeExists = await Grade.findOne({ student: student._id, course: courseId });
  if (gradeExists) {
    res.status(400);
    throw new Error('Nilai untuk mahasiswa ini di mata kuliah ini sudah ada. Gunakan fitur update.');
  }

  const grade = new Grade({
    student: student._id,
    course: courseId,
    score,
  });

  const createdGrade = await grade.save();
  res.status(201).json(createdGrade);
});

// @desc    Update nilai
// @route   PUT /api/grades/:id
// @access  Private/Dosen
const updateGrade = asyncHandler(async (req, res) => {
  const { score } = req.body;
  const grade = await Grade.findById(req.params.id);

  if (grade) {
    grade.score = score;
    const updatedGrade = await grade.save();
    res.json(updatedGrade);
  } else {
    res.status(404);
    throw new Error('Data nilai tidak ditemukan');
  }
});

// @desc    Get grades for a specific course
// @route   GET /api/grades/course/:courseId
// @access  Private/Dosen
const getGradesByCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId).populate('students', 'name studentId');

    if (!course) {
        res.status(404);
        throw new Error('Mata kuliah tidak ditemukan');
    }

    const grades = await Grade.find({ course: req.params.courseId });

    const studentGrades = course.students.map(student => {
        const grade = grades.find(g => g.student.equals(student._id));
        return {
            student: {
                _id: student._id,
                name: student.name,
                studentId: student.studentId,
            },
            _id: grade ? grade._id : null, // ID nilai jika ada
            score: grade ? grade.score : '', // Skor jika ada
        };
    });

    res.json(studentGrades);
});

// @desc    Get transcript for a student
// @route   GET /api/grades/transcript/:studentId
// @access  Private
const getTranscript = asyncHandler(async (req, res) => {
  const grades = await Grade.find({ student: req.params.studentId }).populate('course', 'name code credits');
  
  // Logika untuk menghitung IPK dan total SKS
  let totalCredits = 0;
  let totalPoints = 0;
  const gradePoints = { A: 4, B: 3, C: 2, D: 1, E: 0 };

  grades.forEach(grade => {
    if (grade.course && grade.score) {
      totalCredits += grade.course.credits;
      totalPoints += gradePoints[grade.score] * grade.course.credits;
    }
  });

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  res.json({
    transcript: grades,
    totalCredits,
    gpa,
  });
});


export {
  addGrade,
  updateGrade,
  getGradesByCourse,
  getTranscript,
};
