import asyncHandler from 'express-async-handler';
import Schedule from '../models/Schedule.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Private
const getSchedules = asyncHandler(async (req, res) => {
  const { day, course, search } = req.query;
  const query = {};

  if (day) query.day = day;
  if (course) query.course = course;
  // Note: search needs more complex logic with population
  
  const schedules = await Schedule.find(query).populate({
      path: 'course',
      select: 'code name credits',
      populate: {
          path: 'lecturer',
          select: 'name'
      }
  });

  res.json(schedules);
});

// @desc    Get a schedule by id
// @route   GET /api/schedules/:id
// @access  Private
const getScheduleById = asyncHandler(async (req, res) => {
    const schedule = await Schedule.findById(req.params.id).populate({
        path: 'course',
        populate: { path: 'lecturer', select: 'name' }
    });
    if (schedule) {
        res.json(schedule);
    } else {
        res.status(404);
        throw new Error('Schedule not found');
    }
});

// @desc    Get schedules for a specific lecturer
// @route   GET /api/schedules/lecturer/:lecturerId
// @access  Private/Dosen
const getSchedulesByLecturer = asyncHandler(async (req, res) => {
    const schedules = await Schedule.find().populate({
        path: 'course',
        match: { lecturer: req.params.lecturerId },
        populate: { path: 'lecturer', select: 'name' }
    });
    
    // Filter out schedules where the course did not match the lecturer
    const filteredSchedules = schedules.filter(s => s.course !== null);

    res.json(filteredSchedules);
});


// @desc    Create a schedule
// @route   POST /api/schedules
// @access  Private/Admin
const createSchedule = asyncHandler(async (req, res) => {
  const { course, day, time, room } = req.body;
  
  const schedule = new Schedule({
    course,
    day,
    time,
    room,
  });

  const createdSchedule = await schedule.save();

  await AuditLog.create({
      user: req.user._id,
      action: 'CREATE_SCHEDULE',
      entity: 'Schedule',
      entityId: createdSchedule._id,
      after: createdSchedule.toObject(),
      ipAddress: req.ip,
  });

  res.status(201).json(createdSchedule);
});

// @desc    Update a schedule
// @route   PUT /api/schedules/:id
// @access  Private/Admin
const updateSchedule = asyncHandler(async (req, res) => {
  const { course, day, time, room } = req.body;
  const schedule = await Schedule.findById(req.params.id);

  if (schedule) {
    const beforeState = schedule.toObject();

    schedule.course = course || schedule.course;
    schedule.day = day || schedule.day;
    schedule.time = time || schedule.time;
    schedule.room = room || schedule.room;

    const updatedSchedule = await schedule.save();

     await AuditLog.create({
        user: req.user._id,
        action: 'UPDATE_SCHEDULE',
        entity: 'Schedule',
        entityId: updatedSchedule._id,
        before: beforeState,
        after: updatedSchedule.toObject(),
        ipAddress: req.ip,
    });

    res.json(updatedSchedule);
  } else {
    res.status(404);
    throw new Error('Schedule not found');
  }
});

// @desc    Delete a schedule
// @route   DELETE /api/schedules/:id
// @access  Private/Admin
const deleteSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);

  if (schedule) {
    const beforeState = schedule.toObject();
    await schedule.deleteOne();

    await AuditLog.create({
        user: req.user._id,
        action: 'DELETE_SCHEDULE',
        entity: 'Schedule',
        entityId: schedule._id,
        before: beforeState,
        ipAddress: req.ip,
    });

    res.json({ message: 'Schedule removed' });
  } else {
    res.status(404);
    throw new Error('Schedule not found');
  }
});

export {
  getSchedules,
  getScheduleById,
  getSchedulesByLecturer,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};