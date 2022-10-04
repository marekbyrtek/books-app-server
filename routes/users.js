const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
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

module.exports = router;
