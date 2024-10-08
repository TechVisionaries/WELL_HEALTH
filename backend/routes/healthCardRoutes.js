import express from 'express';
import { create_health_card } from '../controllers/healthCardController.js'


const router = express.Router()

router.post('/create', create_health_card);


export default router;
