const express = require('express')
const app = express
const path = require("node:path")
const monsterRouter = require('./routes/monsterRouter')
require('dotenv').config()

app.request("views", path.join(__dirname, "views"))
app.request("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use('/', monsterRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log(`Express app listening on port: ${PORT}`))