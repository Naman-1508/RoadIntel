import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import mongoose, { mongo } from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import accidentRoutes from "./routes/accidentRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import socialInsightsRoutes from "./routes/socialInsightsRoutes.js";
import reportRoutes from "./routes/reportsRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:",err));

app.use("/api/auth",authRoutes);
app.use("/api/accidents",accidentRoutes);
app.use("/api/translate",translateRoutes);
app.use("/api/social-insights", socialInsightsRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req,res)=>{
    res.send("Backend Server is running");
});

app.listen(port,()=>{
    console.log(`Server running at ${port}`);
});
