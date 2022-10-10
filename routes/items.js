const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/add", (req, res) => {
    const { name, tags, collection } = req.body;
    db.query("INSERT INTO items (name, tags, collection) VALUES (?, ?, ?)",
    [name, JSON.stringify(tags), collection],
    (err, result) => {
        if (err) {
            res.status(401).json({
                message: "Can't add item",
                err
            })
        } else {
            res.status(200).json({
                message: "Item added",
                result
            })
        }
    })
})

module.exports = router;
