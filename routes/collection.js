const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/add", (req, res) => {
    const { name, description, topic, userid } = req.body;
    db.query(
        "INSERT INTO collection (name, description, topic, user) VALUES (?, ?, ?, ?)",
        [name, description, topic, userid],
        (err, result) => {
            if (err) {
                res.status(401).json({
                    message: "Can't add collection",
                    err
                })
            } else {
                res.status(200).json({
                    message: "Collection added",
                    result
                })
            }
        }
    )
})

router.get("/get/:userID", (req, res) => {
    const id = req.params.userID;
    db.query(`SELECT idcollection, name, description, topic FROM collection WHERE user = ${id}`, (err, result) => {
        if (err) {
            res.status(401).json({
                message: "Can't get collections",
                err
            })
        } else {
            res.status(200).json({ result })
        }
    })
})

module.exports = router;
