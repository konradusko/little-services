const route = require('express').Router();
const {
    isUserAuthorization
} = require('../validation');

route.get('/home', (req, res) => {
    res.render('PageTemplate.ejs', {
        templateToSend: '/home'
    });
})

route.post('/home', (req, res) => {
    console.log('dzialalallal')
    const page = "homePageAfterLogin.ejs";
    isUserAuthorization(req, res, page);
})
module.exports = route;