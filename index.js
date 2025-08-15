import express from "express";
import dotenv from "dotenv";
import { DBConnection } from "./config/connectDB.js";
import morgan from "morgan";
import routes from "./routes/index.js";
dotenv.config();
const app = express();

//port
const PORT = Number(process.env.PORT) || 7000;

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use("/resources", express.static("public"));

//routes
app.use("/api/v1", routes);

//Application level middlewre
app.use((err, req, res, next) => {
  const errMsg = err.toString() || "Something went wrong";
  res.status(500).json({ data: null, messge: errMsg });
});

const startServer = async () => {
  await DBConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
  });
};
startServer();
