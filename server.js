require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { db } = require("./config/db");
const app = express();
app.use(express.json());
app.use(cors());

const userRouter = require("./routes/users");
const { verify } = require("./routes/middleware");

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Connected to port ${PORT}`));

app.use("/api/users", userRouter);
app.get("/api/auth", verify, (req, res) => {
    const user = req.user;
    res.status(200).json({
        message: "You are authenticated",
        user
    })
})