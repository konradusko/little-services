const route = require('express').Router();
route.get('/auth', (req, res) => {
    const token = req.query.token;
    const refreshToken = req.query.refreshToken;
    if(token && refreshToken){
        res.render('auth.ejs', 
            {token:token,
            refreshToken:refreshToken}
        )
    }else{
        res.redirect('/login')
    }
})



module.exports = route;