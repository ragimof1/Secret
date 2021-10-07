const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const ejs = require('express-ejs-layouts')

//Static files
app.use(express.static('public'))

//View engine
app.set('views', './views')
app.set('view engine', 'ejs')

//Routes
app.get('/', (req,res) => {
    res.render('index.ejs')
})
app.all("*", (req,res) => {
    res.status(400).send("Error 404 Not Found")
})


app.listen(port, () => console.log(`Server started on port ${port}`))