const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ragimov1:ragimov1123@cluster0.y9hfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let session;
let user = {}


async function signup(client, data, res){
    const email = await client.db("secret_db").collection("users").findOne({ email: data.email })
    const username = await client.db("secret_db").collection("users").findOne({ username: data.username })
    if(email || username){
        res.render("index", {error: "This user already exists."})
    }else{
        await client.db("secret_db").collection("users").insertOne(data)
        res.render("index", {error: false})
    }
}
async function login(client, email, password, req, res){
    const result = await client.db("secret_db").collection("users").findOne({
        email: email,
        password: password
    })
    if(result){
        session = req.session
        session.email = email
        user = result
        const cursor = await client.db("secret_db").collection("secrets").find({ user: user.username })
        const secret = await cursor.toArray()
        if(secret.join("") === ""){
            res.render("dashboard", { username: user.username, secrets: false, page: 'Dashboard' })
        }else{
            res.render('dashboard', { username: user.username, secrets: secret, page: 'Dashboard' })
        }
    }else{
        res.redirect('/')
    }
}
async function secrets(client, req, res, session){
    if(user.username){
        const cursor = await client.db("secret_db").collection("secrets").find({ user: user.username })
        const secret = await cursor.toArray()
        if(secret.join("") === ""){
            res.render("dashboard", { username: user.username, secrets: false, page: 'Dashboard' })
        }else{
            res.render('dashboard', { username: user.username, secrets: secret, page: 'Dashboard' })
        }
    }else{
        res.redirect("/")
    }
}
async function feed(client, res){
    if(user.email){
        const cursor = client.db("secret_db").collection("secrets").find({})
        const secrets = await cursor.toArray();
        res.render("feed", { page: "Feed", secrets: secrets })
    }else{
        res.redirect('/')
    }
}
async function addSecret(client, data, res){
    const result = await client.db("secret_db").collection("secrets").insertOne({
        id: data.id,
        user: user.username,
        title: data.title,
        shortText: data.shortText,
        fullText: data.fullText
    })
    if(result){
        res.render("add", { page: "Secret.", status: true })
    }else{
        res.render("add", { page: "Secret.", status: false })
    }
}
async function secret(client, id, res){
    if(user.username){
        const result = await client.db("secret_db").collection("secrets").findOne({ id: id })
        if(result){
            res.render('secret', { page: 'Secret.', secret: result })
        }else{
            res.send("Couldn't find secret...")
        }
    }else{
        res.redirect('/')
    }
}
function logout(req,res){
    user = {}
    req.session.destroy()
    res.redirect('/')
}
async function remove(client, id, res){
    if(user.email){
    const result = await client.db("secret_db").collection("secrets").findOne({ user: user.username, id: id })
    if(result){
        await client.db("secret_db").collection("secrets").deleteOne({ user: user.username, id: id })
        res.redirect('/dashboard')
    }else{
        res.send('Error')
    }
    }else{
        res.redirect('/')
    }
}

module.exports = { MongoClient, uri, client, login, signup, addSecret, secrets, secret, remove, feed, logout, session, user}