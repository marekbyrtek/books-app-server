const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/add", (req, res) => {
    const { collection, user, comment } = req.body;
    db.query("INSERT INTO comments (collection, user, comment) VALUES (?, ?, ?)",
    [collection, user, comment],
    (err, result) => {
        if (err) {
            res.status(401).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "Comment added",
            result
        })
    })
})

router.post("/delete", (req, res) => {
    const { idcomments } = req.body;
    db.query(`DELETE FROM comments WHERE idcomments = ${idcomments}`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "Comment deleted",
            result
        })
    })
})

module.exports = router;
