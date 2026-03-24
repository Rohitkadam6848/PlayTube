import dotenv from "dotenv";
dotenv.config();
import express from "express";
import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import contentRouter from "./routes/contentRoute.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/content", contentRouter);

app.listen(port, () => {
  dbConnect();
  console.log(`server is running on ${port}`);
});
