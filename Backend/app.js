require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const leadershipRoutes = require("./Routes/leadershipRoutes");
const technicalRoutes = require("./Routes/technicalRoutes");
const quizRoutes = require("./Routes/quizRoutes");
const enrollmentRoutes = require("./Routes/enrollmentRoutes");
const chatRoutes = require("./Routes/chatRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
    res.send("It is working");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leadership", leadershipRoutes);
app.use("/api/technical", technicalRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/chat", chatRoutes);

mongoose.connect("mongodb+srv://admin:H4eQUj4fjzqgjrlX@cluster0.j4bshhl.mongodb.net/")
.then(()=> console.log("Connected to mongoDB"))
.then(()=> {
    app.listen(5000, () => {
        console.log("Server listening on port 5000");
    });
})
.catch((err)=> console.log((err)));