import express from 'express';
import authRouter from './routes/authroutes.js';
import interviewRouter from './routes/interview-routes.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
  origin: 'https://gen-ai-frontend-gilt.vercel.app',
  credentials: true,
}));

app.use('/api/interview', interviewRouter);
app.use('/api/auth', authRouter);

export default app;