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

router.get("/home", (req, res) => {
    db.query(`SELECT items.name, collection.name AS collection, users.name AS author FROM items
    JOIN collection ON items.collection = collection.idcollection
    JOIN users ON collection.user = users.idusers
    ORDER BY iditems DESC LIMIT 5;`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json(result)
    })
})

module.exports = router;
