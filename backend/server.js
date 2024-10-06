import express from 'express';
import bodyParser from 'body-parser'; 
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// import userRoutes from './routes/userRoutes.js';


dotenv.config();

const PORT = process.env.PORT || 5005;

const app = express(); 

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());

// app.use('/api/users', userRoutes);


if(process.env.NODE_ENV === 'production'){
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')));

    app.get('/*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
}else{
    app.get('/', (req, res) => res.send('Server is ready'));
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
    connectDB();
});


