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

router.get("/get/:collection", (req, res) => {
    const collection = req.params.collection;
    db.query(`SELECT iditems, name, tags FROM items WHERE collection = ${collection}`, (err, result) => {
        if (err) {
            res.status(401).json({
                message: "Can't get items",
                err
            })
        } else {
            res.status(200).json({ result })
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

router.post("/delete", (req, res) => {
    const { iditems } = req.body;
    db.query(`DELETE FROM items WHERE iditems = ${iditems}`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "Item deleted",
            result
        })
    })
})

router.put("/update", (req, res) => {
    const { iditems, name, tags } = req.body;
    db.query(`UPDATE items SET name = "${name}", tags = JSON_ARRAY(${tags.map((el) => `"${el}"`)}) WHERE iditems = ${iditems};`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "Item changed",
            result
        })
    })
})

module.exports = router;
