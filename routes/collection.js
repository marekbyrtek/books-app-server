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

router.get("/", (req, res) => {
    db.query(`SELECT idcollection, collection.name AS name, description, topic, users.name AS author FROM collection
    JOIN users ON collection.user = users.idusers;`, (err, result) => {
        if (err) {
            res.status(401).json({
                message: "Can't get collections",
                err
            })
        } else {
            res.status(200).json(result)
        }
    })
})

router.get("/user/:userID", (req, res) => {
    const id = req.params.userID;
    db.query(`SELECT idcollection, collection.name AS name, description, topic, users.name AS author FROM collection
    JOIN users ON collection.user = users.idusers
    WHERE user = ${id};`, (err, result) => {
        if (err) {
            res.status(401).json({
                message: "Can't get collections",
                err
            })
        } else {
            res.status(200).json(result)
        }
    })
})

router.get("/home", (req, res) => {
    db.query(`SELECT idcollection, collection.name, collection.topic, users.name AS author, COUNT(iditems) AS items FROM collection
    JOIN items ON collection.idcollection = items.collection
    JOIN users ON collection.user = users.idusers
    GROUP BY idcollection ORDER BY items DESC LIMIT 5;`, (err, result) => {
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
    const { idcollection } = req.body;
    db.query(`DELETE collection.*, items.* FROM collection
    LEFT JOIN items ON collection.idcollection = items.collection
    WHERE collection.idcollection = ${idcollection};`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
                err
            })
        }
        res.status(200).json({
            message: "Collection deleted",
            result
        })
    })
})

module.exports = router;
