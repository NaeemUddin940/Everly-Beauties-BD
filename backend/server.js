import cors from "cors";
import express from "express";

import cookieParser from "cookie-parser";
import connectDB from "./config/connectDb.js";
import campaignRoute from "./routes/campaign.route.js";
import heroSliderRoute from "./routes/heroslider.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

const port = process.env.PORT || 8080;

app.use(cookieParser());
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
app.use("/api/offers/campaign", campaignRoute);

app.use("/api/user", userRoute);

// Server is Running
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
