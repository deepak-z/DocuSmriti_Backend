const express = require("express")
const router = express.Router()

router.get("/",(req,res) => {
    res.send("Welcome to DocuSmriti Backend")
})

module.exports = router