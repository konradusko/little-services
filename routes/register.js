const route = require('express').Router();
route.get('/register', (req, res) => {
res.render('register.ejs')
})

module.exports = route;