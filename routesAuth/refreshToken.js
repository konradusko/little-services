const route = require('express').Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../model/User');
const fs = require('fs')
route.post('/refreshToken',(req,res)=>{
    console.log('XD')
    console.log(req.body)
    let templateToSend;
    if(req.body.path == '/home'){
         templateToSend = "homePageAfterLogin.ejs";
    }else if(req.body.path == '/notePad'){
        templateToSend = "notePad.ejs";
    }
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]
    if(refreshToken =="null"|| refreshToken == null){
        //nie mamy tokena to na '/login
        return res.json({error:'TokenNull'});
    }
    //stworzyc nowe tokeny 

    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,async(err,user)=>{
        if(err) return res.json({error:err});
        const acessToken  = jwt.sign({
          _id:  user._id
        }, process.env.TOKEN_SECRET, {
            expiresIn: '15s'
        }); //tworze token
        const userFromDB = await UserModel.findOne({_id:user._id});//szukam w bazie danych tego uzytkonwika
        fs.readFile('views/'+templateToSend, "utf-8", (err, temp) => {
            //wysylam templatke i usera
            ///jesli nie bedzie usera to trzeba jeszcze tutaj poprawic to wysylanie
            res.json({
                error:false,
                token:acessToken, 
                template: temp,
                user: userFromDB.name
            })
        })
        
    })
})

module.exports = route;