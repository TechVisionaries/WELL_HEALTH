import express from 'express';
import {getHospitalsBySector,getAllHospitals,getDoctorsByHospital} from '../controllers/hospitalController.js';

const router = express.Router();

router.get('/:sector', getHospitalsBySector);
router.get('/', getAllHospitals);
router.get('/doctors/name', getDoctorsByHospital);

export default router;