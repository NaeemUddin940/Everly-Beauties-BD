import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import connectDB from "./db/connectDb.js";
import productRoute from "./routes/products.route.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 8080;

app.use(express.json());
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

app.use("/api/user", productRoute);

// Server is Running
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
