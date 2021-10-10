let { logged } = require('../mongodb/db')

function ensureGuest(req,res,next){
    if(logged){
        res.redirect('/dashboard')
    }else{
        return next()
    }
}

function ensureAuth(req,res,next){
    if(logged){
        return next()
    }else{
        res.redirect('/')
    }
}

module.exports = {ensureAuth, ensureGuest}