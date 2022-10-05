require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

router.post("/register", async (req, res) => {
    const { email, name, password } = req.body;
    try {
        await bcrypt.hash(password, 10)
        .then((hash) => {
            db.query(
                "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
                [email, name, hash],
                (err, result) => {
                    if (err) {
                        res.status(401).json({
                        message: "Account already exist",
                        err
                    })
                    } else {
                        res.status(200).json({
                            message: "User created",
                            result
                        })
                    }
                }
            )
        })
    } catch(err) {
        res.status(500).json({
            message: "An error occurred",
            err
        })
    }
})

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT idusers, email, password FROM users WHERE email = "${email}"`, async (err, result) => {
        if (err) {
            res.status(401).json({
                message: "Login not successful",
                err
            })
        }
        const user = result[0];
        try {
            await bcrypt.compare(password, user.password)
            .then((hash) => {
                if (!hash) {
                    res.status(401).json("Password is incorrect")
                } else {
                    console.log(hash);
                    const accessToken = jwt.sign({id: user.idusers, email: user.email}, process.env.ACCESS_TOKEN);
                    res.status(200).json({
                        token: accessToken,
                        message: "Login successful",
                        user
                    })
                }
            })
        } catch(err) {
            res.status(401).json({
                message: "Email is incorrect",
                err
            })
        }
    })
})

module.exports = router;
