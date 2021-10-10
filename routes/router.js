const express = require('express')
const router = express.Router()
const db = require('../mongodb/db')
const uuid = require('uuid')
const { ensureAuth, ensureGuest} = require('../middleware/logged')


router.get('/', (req,res) => {
    res.render('index', {error: false})
})
router.post('/dashboard', async (req,res) => {
    try{
        await db.client.connect()
        await db.login(db.client, req.body.loginEmail, req.body.loginPass, res)
    }catch(err){
        console.log(err)
    }finally{
        db.client.close()
    }
})
router.post('/', async (req,res) => {
    try{
        await db.client.connect()
        if(req.body.signPass === req.body.retypePass){
            await db.signup(db.client, {
                username: req.body.username,
                email: req.body.signEmail,
                password: req.body.signPass
            }, res)
        }else{
            if(req.body.signPass !== req.body.retypePass){
                res.render('index', {error: "Passwords don't match"})
            }else{
                res.send("An error ocurred")
            }
        }
    }catch(err){
        console.log(err)
    }finally{
        db.client.close()
    }
})
router.get('/dashboard', (req,res) => {
    res.render("dashboard")
})



module.exports = router