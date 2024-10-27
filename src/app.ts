import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import userRoute from "./routes/userRoute";
import eventRoute from "./routes/eventRoute";
import recruitmentRoute from "./routes/recruitmentRoute";

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(express.json());
// CORSの設定
const corsOptions = {
  origin: "*", // 全てのオリジンを許可
  methods: ["GET", "POST", "PUT", "DELETE"], // 許可するメソッド
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"], // 許可するヘッダー
};

// CORSミドルウェアを使用
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRoute);
app.use("/event", eventRoute);
app.use("/recruitment", recruitmentRoute);

export { app, server };
