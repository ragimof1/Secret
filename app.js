const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const ejs = require('express-ejs-layouts')
const router = require('./routes/router')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//Static files
app.use(express.static('public'))

//View engine
app.set('views', './views')
app.set('view engine', 'ejs')

//Body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "GTrGAClDMNFz",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// cookie parser middleware
app.use(cookieParser());

//Routes
app.use('/', router)
app.all("*", (req,res) => {
    res.status(400).send("Error 404 not found...")
})


app.listen(port, () => console.log(`Server started on port ${port}`))