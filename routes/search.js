const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    db.query("SELECT tag FROM tags;", (err, result) => {
        if (err) {
            res.status(401).json({
                message: "Can't get tags",
                err
            })
        } else {
            const tags = result.map((el) => el.tag);
            res.status(200).json([...new Set(tags)])
        }
    })
})

router.get("/:tag", (req, res) => {
    const tag = req.params.tag;
    db.query(`SELECT items.name, collection.name AS collection, users.name AS author, idcollection FROM items
    JOIN collection ON items.collection = collection.idcollection
    JOIN users ON collection.user = users.idusers
    JOIN tags ON items.iditems = tags.item
    WHERE tag = "${tag}";`, (err, result) => {
        if (err) {
            res.status(401).json({
                message: "Can't get tags",
                err
            })
        } else {
            res.status(200).json(result)
        }
    })
})

module.exports = router;
