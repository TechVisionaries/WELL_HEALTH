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
        return res.status(400).json({ message: "Invalid Date!" });
    }

    let shiftList = []
    for (const staff of staffList) {  
        const shiftExist = await Shift.findOne({ staffMember: staff, date, shiftSlot });
        if (shiftExist) {
            return res.status(400).json({ message: "Shift already created for this staff member" });
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
        return res.status(400).json({ message: "Error creating shift" });
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
        return res.status(400).json({ message: 'Invalid Date!' });
    }

    const shiftExist = await Shift.findOne({ staffMember: id, date, shiftSlot });
    if (shiftExist) {
        res.status(400);
        return res.status(400).json({ message: 'You already have a shift assigned. Please contact your supervisor!' });
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
        return res.status(400).json({ message: 'Error applying leave' });
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
        return res.status(400).json({ message: 'Leave Not Found' });
    }

    let shift;

    if (status === "confirm") {
        // Update the shift status to 'On Leave'
        shift = await Shift.findByIdAndUpdate(id, { status: "On Leave" }, { new: true });
        if(shift){
            const leaveAcceptedHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #4CAF50;">Leave Request Accepted</h2>
                    <p>Dear ${shiftExist.staffMember.firstName},</p>
                    <p>Your leave request made on <strong>${new Date(shiftExist.date).toLocaleDateString()}</strong> for the <strong>${shiftExist.shiftSlot}</strong> shift has been <strong style="color: #4CAF50;">accepted</strong>!</p>
                    <p>Feel free to reach out if you have any questions.</p>
                    <p>Best regards,<br>Your Company</p>
                </div>
            `;
            sendMail(shiftExist.staffMember.email, leaveAcceptedHtml, "Leave Request");
        }
    } else {
        // Delete the shift
        shift = await Shift.findByIdAndDelete(id);
        if(shift){
            const leaveRejectedHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #F44336;">Leave Request Rejected</h2>
                    <p>Dear ${shiftExist.staffMember.firstName},</p>
                    <p>Your leave request made on <strong>${new Date(shiftExist.date).toLocaleDateString()}</strong> for the <strong>${shiftExist.shiftSlot}</strong> shift has been <strong style="color: #F44336;">rejected</strong>.</p>
                    <p>If you have any concerns, feel free to contact us for more information.</p>
                    <p>Best regards,<br>Your Company</p>
                </div>
            `;
            sendMail(shiftExist.staffMember.email, leaveRejectedHtml, "Leave Request");
        }
    }
    

    if (shift) {
        res.status(201).json({ shift });
    } else {
        return res.status(400).json({ message: 'Error updating leave' });
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
        res.status(200).json({ status: "Shift removed" });
    } catch (error) {
        return res.status(400).json({ message: 'Error Deleting shift' });
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
        return res.status(400).json({ message: 'No Shifts found' });
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
        return res.status(400).json({ message: 'No Staff available' });
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
        return res.status(400).json({ message: 'No Shifts available' });
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