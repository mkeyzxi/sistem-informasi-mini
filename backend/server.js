
// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from './config/db.js';
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// // Import Routes
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import courseRoutes from './routes/courseRoutes.js';
// import scheduleRoutes from './routes/scheduleRoutes.js';
// import gradeRoutes from './routes/gradeRoutes.js';
// import auditLogRoutes from './routes/auditLogRoutes.js';
// import enrollmentRoutes from './routes/enrollmentRoutes.js'; // <-- DITAMBAHKAN

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json()); // Body parser

// // Mount Routes
// app.get('/', (req, res) => {
//   res.send('SIAKAD API is running...');
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/schedules', scheduleRoutes);
// app.use('/api/grades', gradeRoutes);
// app.use('/api/audit-logs', auditLogRoutes);
// app.use('/api/enrollments', enrollmentRoutes); // <-- DITAMBAHKAN


// // Custom Error Handling
// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () =>
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
// );



import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
// import enrollmentRoutes from './routes/enrollmentRoutes.js'; // Note: This seems redundant if handled within other routes

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser

// Mount Routes
app.get('/', (req, res) => {
  res.send('SIAKAD API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/audit-logs', auditLogRoutes);
// app.use('/api/enrollments', enrollmentRoutes); // Note: Enrollment logic is likely part of courseRoutes


// Custom Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);