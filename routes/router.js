const express = require('express')
const router = express.Router()
const db = require('../mongodb/db')
const uuid = require('uuid')
const { ensureAuth, ensureGuest} = require('../middleware/logged')
let ses;

router.get('/', (req,res) => {
    ses = req.session
    if(ses.email){
        res.redirect('/dashboard')
    }else{
    res.render('index', {error: false})
    }
})
router.post('/dashboard', async (req,res) => {
    try{
        await db.client.connect()
        await db.login(db.client, req.body.loginEmail, req.body.loginPass, req, res)
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
router.get('/dashboard', async (req, res) => {
    if(ses.email){
    try{
        await db.client.connect()
        await db.secret(db.client, req, res, ses)
    }catch(err){
        console.log(err)
    }finally{
        db.client.close()
    }
}else{
    res.redirect('/')
}
})
router.get('/logout', async (req,res) => {
    req.session.destroy()
    res.redirect('/')
})
router.get('/add', (req,res) => {
    if(ses.email){
        res.render('add', { page: 'Secret.' })
    }else{
        res.redirect('/')
    }
})
router.post('/add', async (req,res) => {
    try{
        const title = req.body.title
        const secret = req.body.secret
        const shortText = secret.split(" ").slice(0,30).join(" ").concat("...[]")
        const id = uuid.v4()
        await db.client.connect()
        await db.addSecret(db.client, {
            id: id,
            title: title,
            shortText: shortText,
            fullText: secret
        })
        res.render("add", { page: "Secret. "})
    }catch(err){
        console.log(err)
    }finally{
        db.client.close()
    }
})


module.exports = router