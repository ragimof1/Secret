const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ragimov1:ragimov1123@cluster0.y9hfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let session;
let user = {}

async function login(client, email, password, req, res){
    const result = await client.db("secret_db").collection("users").findOne({
        email: email,
        password: password
    })
    if(result){
        session = req.session
        session.email = email
        user = result
        res.render('dashboard', { username: user.username })
    }else{
        res.redirect('/')
    }
}

async function signup(client, data, res){
    const email = await client.db("secret_db").collection("users").findOne({ email: data.email })
    const username = await client.db("secret_db").collection("users").findOne({ username: data.username })
    if(email || username){
        console.log("Error")
        res.render("index", {error: "This user already exists."})
    }else{
        await client.db("secret_db").collection("users").insertOne(data)
        res.render("index", {error: false})
    }
}


module.exports = { MongoClient, uri, client, login, signup, session, user}