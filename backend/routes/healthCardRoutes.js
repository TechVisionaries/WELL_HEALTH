import express from 'express';
import { addPrescription, create_health_card, get_health_card_by_patient_id, get_prescription_by_patient_id, getAllPatients, getAllUDoctors, update_health_card } from '../controllers/healthCardController.js'


const router = express.Router()

router.post('/create', create_health_card);
router.get('/get_all_doctors', getAllUDoctors);
router.get('/get_hralth_card_by_patient_id/:userId',get_health_card_by_patient_id)
router.get('/get_all_patients', getAllPatients);
router.post('/add_prescription', addPrescription);
router.get('/get_all_prescriptions/:userId', get_prescription_by_patient_id);
router.post('/update_health_card/:userId/:health_card_id', update_health_card);

export default router;
