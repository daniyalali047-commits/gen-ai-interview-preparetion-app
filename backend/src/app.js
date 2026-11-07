import express from 'express';
import authRouter from './routes/authroutes.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors'


const app = express();
        
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
    origin:'https://glowing-waddle-6vgj4v75xjxr2444x-5173.app.github.dev',
    credentials:true
})
)
app.use('/api/auth', authRouter);



export default app;