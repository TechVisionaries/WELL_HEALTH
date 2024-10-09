import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Shift from '../models/shiftModel.js';

// @desc    Create Shift
// route    POST /api/shift/
// @access  Private
const createShift = asyncHandler(async (req, res) => {
    const {
        email, 
        role,
        location,
        date,
        shiftSlot
    } = req.body;

    var staffMember = await User.findOne({ email });
    if(!staffMember){
        res.status(400);
        throw new Error('Staff member not found!');
    }

    if(new Date(date) < new Date()){
        res.status(400);
        throw new Error('Invalid Date!');
    }

    const shiftExist = await Shift.findOne({ staffMember, date, shiftSlot })
    if(shiftExist){
        res.status(400);
        throw new Error('Shift Already created');
    }

    const shift = await Shift.create({
        staffMember: staffMember,
        role: role,
        location: location,
        date: date,
        shiftSlot: shiftSlot,
    });

    if(shift){
        res.status(201).json({shift});
    }
    else {
        res.status(400);
        throw new Error('Error creating shift');
    }
});

// @desc    Get all shifts
// route    GET /api/shift/:date
// @access  Private
const getAllShifts = asyncHandler(async (req, res) => {

    const date = req.params.date;

    const shifts = await Shift.find({date});

    if(shifts && shifts.length > 0){
        res.status(201).json({shifts});
    }
    else {
        res.status(400);
        throw new Error('No Shifts found for the day');
    }

});

// @desc    Get all staff users who dont have any shifts
// route    GET /api/shift/available/staff/:date
// @access  Private
const getAVailableStaff = asyncHandler(async (req, res) => {

    const date = req.params.date;

    // Get all user IDs who already have shifts on the given date
    const usersWithShifts = await Shift.find({
        date: date
    }).distinct('staffMember');

    // Filter eligible users who are not in the usersWithShifts list
    const availableUsers = await User.find({
        _id: { $nin: usersWithShifts },
        userType: { $in: ['nurse', 'trainee'] }
    });
    

    if(availableUsers && availableUsers.length > 0){
        res.status(201).json({availableUsers});
    }
    else {
        res.status(400);
        throw new Error('No Staff available for the day');
    }

});

export { 
    createShift,
    getAllShifts,
    getAVailableStaff
};