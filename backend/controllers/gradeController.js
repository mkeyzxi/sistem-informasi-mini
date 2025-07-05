import asyncHandler from 'express-async-handler';
import Grade from '../models/Grade.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

// @desc    Menambahkan atau membuat nilai baru
// @route   POST /api/grades
// @access  Private/Dosen
const addGrade = asyncHandler(async (req, res) => {
  // `studentIdentifier` adalah _id mahasiswa dari frontend
  // Properti 'semester' tidak lagi diambil dari req.body
  const { student: studentIdentifier, course: courseId, score } = req.body;

  // Mencari mahasiswa berdasarkan ID unik (_id)
  const student = await User.findById(studentIdentifier);
  if (!student) {
    res.status(404);
    throw new Error('Mahasiswa dengan ID tersebut tidak ditemukan');
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

  // Membuat data nilai baru tanpa 'semester'
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
  // Hanya properti 'score' yang diupdate
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
            _id: grade ? grade._id : null,
            score: grade ? grade.score : '',
            // Properti 'semester' telah dihapus dari data yang dikirim ke frontend
        };
    });

    res.json(studentGrades);
});

// @desc    Get transcript for a student
// @route   GET /api/grades/transcript/:studentId
// @access  Private
const getTranscript = asyncHandler(async (req, res) => {
  const grades = await Grade.find({ student: req.params.studentId }).populate('course', 'name code credits');
  
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