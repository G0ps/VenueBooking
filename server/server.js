import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import ngrok from 'ngrok';

import * as mongoDb from './database/mongoDb.js';
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import venueRouter from "./routes/venueRoutes.js";
import amenityRouter from "./routes/amenityRoutes.js";

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    // or reflect back the origin to allow all
    callback(null, origin || true);
  },
  credentials: true,
}));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {res.send("Hello from Backend"); console.log("Frontend connected")});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/venues' , venueRouter);
app.use('/api/amenities' , amenityRouter);

// DB Connect
mongoDb.connect();

// Start server
app.listen(port,'0.0.0.0' ,async () => {
  console.log(`Server is running on http://localhost:${port}`);
});
