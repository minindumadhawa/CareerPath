const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use("/", (req,res, nset) => {
    res.send("It is working");
})

mongoose.connect("mongodb+srv://admin:H4eQUj4fjzqgjrlX@cluster0.j4bshhl.mongodb.net/")
.then(()=> console.log("Connected to mongoDB"))
.then(()=> {
    app.listen(5000);
})
.catch((err)=> console.log((err)));