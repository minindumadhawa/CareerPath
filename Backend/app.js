const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const studentRoutes = require("./Routes/studentRoutes");
const companyRoutes = require("./Routes/companyRoutes");

app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);

app.get("/", (req, res) => {
    res.send("CareerPath API is running");
});

mongoose.connect("mongodb+srv://admin:H4eQUj4fjzqgjrlX@cluster0.j4bshhl.mongodb.net/CareerPath?retryWrites=true&w=majority")
.then(()=> console.log("Connected to mongoDB"))
.then(()=> {
    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    });
})
.catch((err)=> console.log((err)));