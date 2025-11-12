import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/connectDb.js";
import heroSliderRoute from "./routes/heroslider.route.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Home Page Route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// app.use("/api/user", productRoute);
app.use("/api/admin/heroslider", heroSliderRoute);

// Server is Running
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
