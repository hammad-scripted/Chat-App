import dotenv from 'dotenv';
dotenv.config({
  path: './.env',
});
import path from 'node:path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1']);
import chalk from 'chalk';
import express from 'express';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import { io, server, app } from './lib/socket.js';
const PORT = process.env.PORT || 5001;
import { connectDB } from './db/connect.js';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// ** MIDDLEWARES
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
    );


// ** ROUTES
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../dist')  ));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

connectDB()
  .then((conn) => {
    console.info(
      chalk.magentaBright(
        `Connected to MongoDB Database ${conn.connection.host}`,
      ),
    );
    server.listen(PORT, () => {
      console.info(chalk.yellow(`Server is running on port ${PORT}`));
    });
  })
  .catch((err) => {
    console.error(chalk.red(`MongoDB connection error ${err}`));
  });
