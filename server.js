const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/assignment")
.then(() => console.log("MongoDB connected successfully"))
.catch((error) => console.log("MongoDB connection failed", error));


app.get("/", (req, res) => {
    res.send("Hello World!");
});


const userSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    password: String
});

const user = mongoose.model("user", userSchema);


app.get("/users", (req, res) => {
    user.find({})
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
});


app.get("/users/id/:id", (req, res) => {
    user.findById(req.params.id)
    .then(data => {
        if(!data){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
});


app.post("/users", (req, res) => {

    const newUser = {
        _id: req.body._id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    user.create(newUser);

    res.status(201).json({
        message: "User added",
        user: newUser
    });
});


app.put("/users/id/:id", async (req, res) => {

    const userId = req.params.id;

    const updatedUser = await user.findByIdAndUpdate(
        userId,
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
    );

    if(!updatedUser){
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User replaced",
        user: updatedUser
    });
});


app.patch("/users/id/:id", async (req, res) => {

    const userId = req.params.id;

    const updatedUser = await user.findByIdAndUpdate(
        userId,
        req.body
    );

    if(!updatedUser){
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User updated",
        user: updatedUser
    });
});


app.delete("/users/id/:id", async (req, res) => {

    const userId = req.params.id;

    const deletedUser = await user.findByIdAndDelete(userId);

    if(!deletedUser){
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User deleted",
        user: deletedUser
    });
});


app.listen(3000, () => {
    console.log("Server started at 3000");
});