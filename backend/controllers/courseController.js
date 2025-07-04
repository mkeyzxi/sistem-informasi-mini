
// import asyncHandler from 'express-async-handler';
// import Course from '../models/Course.js';
// import AuditLog from '../models/AuditLog.js';
// import Grade from '../models/Grade.js';

// // @desc    Fetch all courses
// // @route   GET /api/courses
// // @access  Private
// const getCourses = asyncHandler(async (req, res) => {
//   const { search } = req.query;
//   const query = {};

//   if (search) {
//     query.$or = [
//       { name: { $regex: search, $options: 'i' } },
//       { code: { $regex: search, $options: 'i' } }
//     ];
//   }

//   const courses = await Course.find(query).populate('lecturer', 'name');
//   res.json(courses);
// });

// // @desc    Fetch single course
// // @route   GET /api/courses/:id
// // @access  Private
// const getCourseById = asyncHandler(async (req, res) => {
//   const course = await Course.findById(req.params.id).populate('lecturer', 'name email');
//   if (course) {
//     res.json(course);
//   } else {
//     res.status(404);
//     throw new Error('Course not found');
//   }
// });

// // @desc    Create a course
// // @route   POST /api/courses
// // @access  Private/Admin
// const createCourse = asyncHandler(async (req, res) => {
//   const { code, name, credits, lecturer } = req.body;

//   const courseExists = await Course.findOne({ code });
//   if (courseExists) {
//       res.status(400);
//       throw new Error('Course with this code already exists');
//   }

//   const course = new Course({
//     code,
//     name,
//     credits,
//     lecturer,
//   });

//   const createdCourse = await course.save();

//   await AuditLog.create({
//       user: req.user._id,
//       action: 'CREATE_COURSE',
//       entity: 'Course',
//       entityId: createdCourse._id,
//       after: createdCourse.toObject(),
//       ipAddress: req.ip,
//   });

//   res.status(201).json(createdCourse);
// });

// // @desc    Update a course
// // @route   PUT /api/courses/:id
// // @access  Private/Admin
// const updateCourse = asyncHandler(async (req, res) => {
//   const { code, name, credits, lecturer } = req.body;
//   const course = await Course.findById(req.params.id);

//   if (course) {
//     const beforeState = course.toObject();

//     course.code = code || course.code;
//     course.name = name || course.name;
//     course.credits = credits || course.credits;
//     course.lecturer = lecturer || course.lecturer;

//     const updatedCourse = await course.save();

//     await AuditLog.create({
//         user: req.user._id,
//         action: 'UPDATE_COURSE',
//         entity: 'Course',
//         entityId: updatedCourse._id,
//         before: beforeState,
//         after: updatedCourse.toObject(),
//         ipAddress: req.ip,
//     });

//     res.json(updatedCourse);
//   } else {
//     res.status(404);
//     throw new Error('Course not found');
//   }
// });

// // @desc    Delete a course
// // @route   DELETE /api/courses/:id
// // @access  Private/Admin
// const deleteCourse = asyncHandler(async (req, res) => {
//   const course = await Course.findById(req.params.id);

//   if (course) {
//     const beforeState = course.toObject();
//     await course.deleteOne();

//     await AuditLog.create({
//         user: req.user._id,
//         action: 'DELETE_COURSE',
//         entity: 'Course',
//         entityId: course._id,
//         before: beforeState,
//         ipAddress: req.ip,
//     });
    
//     res.json({ message: 'Course removed' });
//   } else {
//     res.status(404);
//     throw new Error('Course not found');
//   }
// });


// // @desc    Get all students enrolled in a course
// // @route   GET /api/courses/:id/students
// // @access  Private/Dosen
// const getEnrolledStudents = asyncHandler(async (req, res) => {
//     const courseId = req.params.id;

//     const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name studentId');

//     if (!enrollments) {
//         return res.json([]);
//     }

//     const grades = await Grade.find({ course: courseId });

//     const enrolledStudents = enrollments.map(enrollment => {
//         const grade = grades.find(g => g.student.toString() === enrollment.student._id.toString());
//         return {
//             _id: enrollment.student._id,
//             studentId: enrollment.student.studentId,
//             name: enrollment.student.name,
//             gradeId: grade ? grade._id : null,
//             score: grade ? grade.score : '',
//             semester: grade ? grade.semester : enrollment.semester,
//         };
//     });

//     res.json(enrolledStudents);
// });


// export { 
//     getCourses, 
//     getCourseById, 
//     createCourse, 
//     updateCourse, 
//     deleteCourse,
//     getEnrolledStudents
// };

import asyncHandler from 'express-async-handler';
import Course from '../models/Course.js';
import User from '../models/User.js'; // Diperlukan untuk mencari mahasiswa
import AuditLog from '../models/AuditLog.js';
import Grade from '../models/Grade.js';

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } }
    ];
  }

  const courses = await Course.find(query).populate('lecturer', 'name');
  res.json(courses);
});

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('lecturer', 'name email');
  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
  const { code, name, credits, lecturer } = req.body;

  const courseExists = await Course.findOne({ code });
  if (courseExists) {
      res.status(400);
      throw new Error('Course with this code already exists');
  }

  const course = new Course({
    code,
    name,
    credits,
    lecturer,
    students: [], // Inisialisasi array mahasiswa
  });

  const createdCourse = await course.save();

  await AuditLog.create({
      user: req.user._id,
      action: 'CREATE_COURSE',
      entity: 'Course',
      entityId: createdCourse._id,
      after: createdCourse.toObject(),
      ipAddress: req.ip,
  });

  res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const { code, name, credits, lecturer } = req.body;
  const course = await Course.findById(req.params.id);

  if (course) {
    const beforeState = course.toObject();

    course.code = code || course.code;
    course.name = name || course.name;
    course.credits = credits || course.credits;
    course.lecturer = lecturer || course.lecturer;

    const updatedCourse = await course.save();

    await AuditLog.create({
        user: req.user._id,
        action: 'UPDATE_COURSE',
        entity: 'Course',
        entityId: updatedCourse._id,
        before: beforeState,
        after: updatedCourse.toObject(),
        ipAddress: req.ip,
    });

    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    const beforeState = course.toObject();
    await course.deleteOne();

    await AuditLog.create({
        user: req.user._id,
        action: 'DELETE_COURSE',
        entity: 'Course',
        entityId: course._id,
        before: beforeState,
        ipAddress: req.ip,
    });
    
    res.json({ message: 'Course removed' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Enroll students in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Admin
const enrollStudents = asyncHandler(async (req, res) => {
    const { studentNims } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Mata kuliah tidak ditemukan');
    }
    
    // FIX: Pastikan properti students ada sebelum digunakan
    if (!course.students) {
      course.students = [];
    }

    const usersToEnroll = await User.find({ studentId: { $in: studentNims } });
    
    if (usersToEnroll.length === 0) {
        res.status(404);
        throw new Error('Tidak ada mahasiswa yang ditemukan dengan NIM yang diberikan.');
    }

    const userIdsToEnroll = usersToEnroll.map(user => user._id);

    // Filter untuk menambahkan hanya mahasiswa yang belum terdaftar
    const newStudentIds = userIdsToEnroll.filter(userId => !course.students.some(enrolledId => enrolledId.equals(userId)));

    if (newStudentIds.length > 0) {
        course.students.push(...newStudentIds);
        await course.save();
    }

    res.status(200).json({ message: `${newStudentIds.length} mahasiswa berhasil ditambahkan.` });
});


// @desc    Get all students enrolled in a course
// @route   GET /api/courses/:id/students
// @access  Private/Dosen
const getEnrolledStudents = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate('students', 'name studentId');

    if (!course) {
        res.status(404);
        throw new Error('Mata kuliah tidak ditemukan');
    }
    
    if (!course.students) {
        return res.json([]);
    }

    const grades = await Grade.find({ course: courseId });

    const enrolledStudentsWithGrades = course.students.map(student => {
        const grade = grades.find(g => g.student.toString() === student._id.toString());
        return {
            _id: student._id,
            studentId: student.studentId,
            name: student.name,
            gradeId: grade ? grade._id : null,
            score: grade ? grade.score : '',
            semester: grade ? grade.semester : null,
        };
    });

    res.json(enrolledStudentsWithGrades);
});


export { 
    getCourses, 
    getCourseById, 
    createCourse, 
    updateCourse, 
    deleteCourse,
    enrollStudents,
    getEnrolledStudents
};
