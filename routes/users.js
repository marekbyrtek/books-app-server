require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

router.get("/", (req, res) => {
    db.query("SELECT idusers, email, name, admin, active FROM users", (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json(result)
    })
})

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
    db.query(`SELECT idusers, email, name, password, admin, active FROM users WHERE email = "${email}"`, async (err, result) => {
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
                    res.status(401).json({
                        message: "Password is incorrect",
                        err
                    })
                } else if (user.active == false) {
                    res.status(401).json({
                        message: "User blocked",
                        error: "User is not active"
                    })
                } else {
                    const accessToken = jwt.sign({id: user.idusers, email: user.email, name: user.name, isAdmin: user.admin}, "secretKey");
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

router.put("/block", (req, res) => {
    const { idusers } = req.body;
    db.query(`UPDATE users SET active = 0 WHERE idusers = ${idusers}`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "User blocked",
            result
        })
    })
})

router.put("/activate", (req, res) => {
    const { idusers } = req.body;
    db.query(`UPDATE users SET active = 1 WHERE idusers = ${idusers}`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "User activated",
            result
        })
    })
})

router.put("/admin/block", (req, res) => {
    const { idusers } = req.body;
    db.query(`UPDATE users SET admin = 0 WHERE idusers = ${idusers}`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "User is not an admin anymore",
            result
        })
    })
})

router.put("/admin/activate", (req, res) => {
    const { idusers } = req.body;
    db.query(`UPDATE users SET admin = 1 WHERE idusers = ${idusers}`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "User set to admin",
            result
        })
    })
})

router.post("/delete", (req, res) => {
    const { idusers } = req.body;
    db.query(`DELETE users.*, collection.*, comments.*, likes.* FROM users
    JOIN collection ON collection.user = users.idusers
    JOIN comments ON comments.user = users.idusers
    JOIN likes ON likes.user = users.idusers
    WHERE idusers = ${idusers}`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "User deleted",
            result
        })
    })
})

router.post("/newtoken/:user", (req, res) => {
    const user = req.params.user;
    db.query(`SELECT idusers, email, name, admin, active FROM users WHERE idusers = ${user}`, (err, result) => {
        if (err) {
            res.status(401).json({
                message: "An error occured",
                err
            })
        } else {
            const user = result[0];
            const accessToken = jwt.sign({id: user.idusers, email: user.email, name: user.name, isAdmin: user.admin}, "secretKey");
                res.status(200).json({
                    token: accessToken,
                    message: "Token changed"
                })
        }
    })
})

module.exports = router;
