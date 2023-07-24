import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

connectDB()

const app = express();
const origin = `${process.env.BASE_ADDRESS}:${process.env.FRONTEND_PORT}`

const options = {
    origin: origin
}

console.log(origin)

app.use(cors(origin))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Server is ready'));

app.listen(port, () => console.log(`Server started on ${port}`));

app.use(notFound);
app.use(errorHandler);