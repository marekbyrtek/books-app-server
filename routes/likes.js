const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/add", (req, res) => {
    const { user, collection } = req.body;
    db.query("INSERT INTO likes (user, collection) VALUES (?, ?)",
    [user, collection],
    (err, result) => {
        if (err) {
            res.status(401).json({
                message: "Can't like collection",
                err
            })
        } 
        res.status(200).json({
            message: "Collection liked",
            result
        })
    })
})

router.post ("/delete", (req, res) => {
    const { user, collection } = req.body;
    db.query(`DELETE FROM likes WHERE user = ${user} AND collection = ${collection}`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "Collection disliked",
            result
        })
    })
})

module.exports = router;
