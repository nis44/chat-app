import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.static("public"))
app.use(cookieParser());

import userRouter from "./routes/user.router.js"
import messageRouter from "./routes/message.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/users", messageRouter)

export {app};