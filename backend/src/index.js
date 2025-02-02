import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js'
import { server } from "./socket.js";


dotenv.config();

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 9000, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed", err);
  });