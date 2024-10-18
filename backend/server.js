import express from 'express';
import bodyParser from 'body-parser'; 
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import userRoutes from './routes/userRoutes.js';  
import paymentRoute from './routes/paymentRoute.js';  
import healthCardRoutes from './routes/healthCardRoutes.js';  
import appointmentRoutes from './routes/appointmentRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import getHospitalsBySector from './routes/hospitalRoutes.js';


dotenv.config();

const PORT = process.env.PORT || 5005;

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
    optionsSuccessStatus: 200, 
};
const app = express(); 

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

// Use routes as needed
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoute);
app.use('/api/health_card', healthCardRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/hospitals', getHospitalsBySector);


if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')));

    app.get('/*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => res.send('Server is ready'));
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
    connectDB();
});
