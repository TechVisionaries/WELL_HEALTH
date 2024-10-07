import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// @desc    Create Health Card
// route    GET /api/health_card/add
// @access  Public
const create_health_card = asyncHandler(async (req, res) => {
    const { 
        userId,
        fullName,
        hospital,
        contact,
        nic,
        emergency,
        inssurance,
        bloodGroup,
        inssuranceId,
        diabetes,
        bloodPressure,
        allergyDrugs,
        diseases,
        eyePressure,
        doctorName 
    } = req.body;


    
    
});

export { 
    create_health_card
};