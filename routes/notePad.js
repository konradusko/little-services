const route = require('express').Router();
const {
    isUserAuthorization
} = require('../validation');

route.get('/notePad',(req,res)=>{
    res.render('PageTemplate.ejs', {
        templateToSend: '/notePad'
    });
})
route.post('/notePad',(req,res)=>{
    const page = "notePad.ejs";
    isUserAuthorization(req, res, page);
})

module.exports = route;
