import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDB from "./config/connectDb.js";
import brandRoute from "./routes/brand.route.js";
import campaignRoute from "./routes/campaign.route.js";
import categoryRoute from "./routes/category.route.js";
import heroSliderRoute from "./routes/heroslider.route.js";
import screenSolutionRoute from "./routes/screenSolution.route.js";
import tagRoute from "./routes/tag.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static("uploads"));
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

app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/admin/heroslider", heroSliderRoute);
app.use("/api/offers/campaign", campaignRoute);
app.use("/api/brand", brandRoute);
app.use("/api/tag", tagRoute);
app.use("/api/screensolution", screenSolutionRoute);

// Server is Running
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
