import dotenv from 'dotenv';
dotenv.config({
  path: './.env',
});
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1']);
import chalk from 'chalk';
import express from 'express';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
const app = express();
const PORT = process.env.PORT || 5001;
import { connectDB } from './db/connect.js';

// ** MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

// ** ROUTES
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

connectDB()
  .then((conn) => {
    console.log(
      chalk.magentaBright(
        `Connected to MongoDB Database ${conn.connection.host}`,
      ),
    );
    app.listen(PORT, () => {
      console.log(chalk.yellow(`Server is running on port ${PORT}`));
    });
  })
  .catch((err) => {
    console.log(chalk.red(`MongoDB connection error ${err}`));
  });
