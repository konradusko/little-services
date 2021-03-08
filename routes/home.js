const route = require('express').Router();
route.get('/',(req,res)=>{
    res.render('home.ejs')
})
module.exports = route;