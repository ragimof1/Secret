const express = require('express')
const router = express.Router()
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ragimov1:ragimov1123@cluster0.y9hfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const uuid = require('uuid')


router.get('/', (req,res) => {
    res.render('index')
})
router.post('/dashboard', async (req,res) => {
    try{
        await client.connect()
        const result = await client.db("secret_db").collection("users").findOne({
            email: req.body.loginEmail,
            password: req.body.loginPass
        })
        if(result){
            res.render('dashboard')
        }else{
            res.render('index')
        }
    }catch(err){
        console.log(err)
    }finally{
        client.close()
    }
})
router.post('/', async (req,res) => {
    try{
        await client.connect()
        if(req.body.signPass === req.body.retypePass){
            await signup(client, {
                username: req.body.username,
                email: req.body.signEmail,
                password: req.body.signPass
            })
            res.render('index')
        }else{
            if(req.body.signPass !== req.body.retypePass){
                res.send("Passwords don't match")
            }else{
                console.log("An error occurred :(")
            }
        }
    }catch(err){
        console.log(err)
    }finally{
        client.close()
    }
})


async function login(client, email, password){
    const result = await client.db("secret_db").collection("users").findOne({
        email: email,
        password: password
    })
    if(result){
        console.log(result)
    }else{
        console.log(`No listings found with the name`)
    }
    
}
async function signup(client, data){
    const result = await client.db("secret_db").collection("users").insertOne(data)
    console.log(`New listing created with the following id: ${result.insertedId}`)
}




module.exports = router