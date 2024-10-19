import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Shift from '../models/shiftModel.js';
import { sendMail } from '../utils/mailer.js';

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

// @desc    Create Leave
// route    POST /api/shift/leave
// @access  Private
const createLeave = asyncHandler(async (req, res) => {
    const {
        staff: id, 
        date,
        shift: shiftSlot,
        reason
    } = req.body;

    if(new Date(date) < new Date()){
        res.status(400);
        throw new Error('Invalid Date!');
    }

    const shiftExist = await Shift.findOne({ staffMember: id, date, shiftSlot });
    if (shiftExist) {
        res.status(400);
        throw new Error('You already have a shift assigned. Please contact your supervisor!');
    }

    const shift = await Shift.create({
        staffMember: id,
        location: reason,
        date: date,
        shiftSlot: shiftSlot,
        status: 'Leave Pending'
    });

    if(shift){
        res.status(201).json({shift});
    }
    else {
        res.status(400);
        throw new Error('Error applying leave');
    }
});

// @desc    Update Leave
// route    PUT /api/shift/leave
// @access  Private
const updateLeave = asyncHandler(async (req, res) => {
    const { id, status } = req.body;

    // Find the shift by ID
    const shiftExist = await Shift.findById(id).populate('staffMember');
    if (!shiftExist) {
        res.status(400);
        throw new Error('Leave Not Found');
    }

    let shift;

    if (status === "confirm") {
        // Update the shift status to 'On Leave'
        shift = await Shift.findByIdAndUpdate(id, { status: "On Leave" }, { new: true });
        if(shift){
            sendMail(shiftExist.staffMember.email, `Your leave request made on ${shiftExist.date?.toLocalString()} ${shiftExist.shiftSlot} has been accepted!`, "Leave Request")
        }
    } else {
        // Delete the shift
        shift = await Shift.findByIdAndDelete(id);
        if(shift){
            sendMail(shiftExist.staffMember.email, `Your leave request made on ${shiftExist.date} ${shiftExist.shiftSlot} has been Rejected!`, "Leave Request")
        }
    }

    if (shift) {
        res.status(201).json({ shift });
    } else {
        res.status(400);
        throw new Error('Error updating leave');
    }
});


// @desc    Delete Shift
// route    DELETE /api/shift/
// @access  Private
const deleteShift = asyncHandler(async (req, res) => {
    const {shift: shiftList} = req.body;

    try {
        for (const shiftId of shiftList) {
            await Shift.findByIdAndDelete(shiftId);
        }
        res.status(200).send({ status: "Shift removed" });;
    } catch (error) {
        res.status(400);
        throw new Error('Error Deleting shift');
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
        shifts = await Shift.find({ date, shiftSlot, location, status: "Assigned" }).populate('staffMember');
    } 
    else {
        // Get all shifts for the given date and shiftSlot and location
        shifts = await Shift.find({ date, shiftSlot, status: "Assigned" }).populate('staffMember');
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
        throw new Error('No Shifts found');
    }

});

// @desc    Get all staff users who dont have any shifts
// route    GET /api/shift/available-staff
// @access  Private
const getAvailableStaff = asyncHandler(async (req, res) => {
    const date = req.query.date || '';
    const shiftSlot = req.query.shift || '';

    let shifts = [];
    
    if (date && shiftSlot) {
        // Get all shifts for the given date and shiftSlot
        shifts = await Shift.find({ date, shiftSlot });
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
        let location = '';
        let apptId = '';
        if (hasAssignedShift) {
            status = 'Assigned';
        } else if (!hasNoShiftAtAll) {
            const userShift = shifts.find(shift => shift.staffMember.toString() === user._id.toString());
            status = userShift ? userShift.status : status; // Retain their status if they have a shift
            location = userShift.location;
            apptId = userShift._id
        }

        return {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            userType: user.userType,
            status: status,
            location: location,
            apptId: apptId
        };
    });

    // Filter out users with Assigned status
    const finalResponseUsers = unAssignedUsers.filter(user => user.status !== 'Assigned');

    if (finalResponseUsers.length > 0) {
        res.status(200).json(finalResponseUsers); // Return the filtered list of users
    } else {
        res.status(400);
        throw new Error('No Staff available');
    }
});

// @desc    Get shifts for particular staff
// route    GET /api/shift/my
// @access  Private
const getStaffShifts = asyncHandler(async (req, res) => {
    const id = req.query.id || '';

    let shifts = [];
    
    if (!id) {
        res.status(400);
        throw new Error('Staff Id not found');
    }

    // Get all shifts for the staff id
    shifts = await Shift.find({ staffMember: id });

    

    if (shifts && shifts.length > 0) {
        res.status(200).json(shifts); // Return the filtered list of users
    } else {
        res.status(400);
        throw new Error('No Shifts available');
    }
});


export { 
    createShift,
    deleteShift,
    getAvailableStaff,
    getAllShifts,
    getStaffShifts,
    createLeave,
    updateLeave
};