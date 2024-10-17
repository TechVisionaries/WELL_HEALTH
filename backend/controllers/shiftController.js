import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Shift from '../models/shiftModel.js';

// @desc    Create Shift
// route    POST /api/shift/
// @access  Private
const createShift = asyncHandler(async (req, res) => {
    const {
        staff: staffList, 
        date,
        location,
        shift: shiftSlot
    } = req.body;

    if(new Date(date) < new Date()){
        res.status(400);
        throw new Error('Invalid Date!');
    }

    let shiftList = []
    for (const staff of staffList) {  
        const shiftExist = await Shift.findOne({ staffMember: staff, date, shiftSlot });
        if (shiftExist) {
            res.status(400);
            throw new Error('Shift already created for this staff member');
        }
    
        const shift = await Shift.create({
            staffMember: staff,
            location: location,
            date: date,
            shiftSlot: shiftSlot,
            status: 'Assigned'
        });

        shiftList.push(shift)
    }

    if(shiftList.length > 0){
        res.status(201).json({shiftList});
    }
    else {
        res.status(400);
        throw new Error('Error creating shift');
    }
});

// @desc    Get all shifts
// route    GET /api/shift/all
// @access  Private
const getAllShifts = asyncHandler(async (req, res) => {

    const date = req.query.date || '';
    const shiftSlot = req.query.shift || '';
    const location = req.query.location || '';

    let shifts = [];
    if (!date || !shiftSlot) {
        return res.status(400);
    }

    if(location){
        // Get all shifts for the given date and shiftSlot and location
        shifts = await Shift.find({ date, shiftSlot, location }).populate('staffMember');
    } 
    else {
        // Get all shifts for the given date and shiftSlot and location
        shifts = await Shift.find({ date, shiftSlot }).populate('staffMember');
    }

    if(shifts && shifts.length > 0){

        res.status(201).json(shifts.map(shift => {
            return {
                id: shift._id,
                name: `${shift.staffMember.firstName} ${shift.staffMember.lastName}`,
                userType: shift.staffMember.userType,
                location: shift.location
            };
        }));
    }
    else {
        res.status(400);
        throw new Error('No Shifts found for the day');
    }

});

// @desc    Get all staff users who dont have any shifts
// route    GET /api/shift/available-staff
// @access  Private
const getAvailableStaff = asyncHandler(async (req, res) => {
    const date = req.query.date || '';

    let shifts = [];
    
    if (date) {
        // Get all shifts for the given date and shiftSlot
        shifts = await Shift.find({ date });
    }

    // Get all user IDs who have an assigned shift
    const assignedUserIds = shifts
        .filter(shift => shift.status === 'Assigned') 
        .map(shift => shift.staffMember.toString());

    // Get all users who have shifts on that date
    const usersWithShifts = shifts
        .map(shift => shift.staffMember.toString());

    // Get All users
    const allUsers = await User.find({
        userType: { $in: ['nurse', 'trainee'] }
    });

    // Map available users to the response
    const unAssignedUsers = allUsers.map(user => {
        // Check if the user has an assigned shift
        const hasAssignedShift = assignedUserIds.includes(user._id.toString());
        const hasNoShiftAtAll = !usersWithShifts.includes(user._id.toString());

        // Determine status based on shift assignment
        let status = 'Available'; // Default to Available
        if (hasAssignedShift) {
            status = 'Assigned';
        } else if (!hasNoShiftAtAll) {
            const userShift = shifts.find(shift => shift.staffMember.toString() === user._id.toString());
            status = userShift ? userShift.status : status; // Retain their status if they have a shift
        }

        return {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            userType: user.userType,
            status: status
        };
    });

    // Filter out users with Assigned status
    const finalResponseUsers = unAssignedUsers.filter(user => user.status !== 'Assigned');

    if (finalResponseUsers.length > 0) {
        res.status(200).json(finalResponseUsers); // Return the filtered list of users
    } else {
        res.status(400);
        throw new Error('No Staff available for the day');
    }
});


export { 
    createShift,
    getAvailableStaff,
    getAllShifts
};