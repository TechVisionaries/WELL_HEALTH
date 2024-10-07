import asyncHandler from 'express-async-handler';
import sendResponse from '../utils/sendResponse.js';
import HealthCard from '../models/healthCardModel.js';


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

    const newHealthCard = {
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
    }

    if (!newHealthCard) {
        return sendResponse(res, 400, false, null, "New health card data undefined");
    }

    const healthCard = await HealthCard.create(newHealthCard)

    if(!healthCard){
    return sendResponse(res, 400, false, null, "Failed to create health card");
    }
    else{
        return sendResponse(res, 200, true, healthCard, "Health card created");
    }
    
});

export { 
    create_health_card
};