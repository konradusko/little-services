const route = require('express').Router();
const UserModel = require('../model/User');
const bcrypt = require('bcryptjs');
const {createTokenAndRefreshToken_SendToUser,registerValidation} = require('../validation');
route.post('/register',async(req,res)=>{
    console.log(req.body.name)
    const {
        error
    } = registerValidation(req.body); //wysylam dane do validacji
    if (error) return res.status(400).send(error.details[0].message) //jesli error to wysylam status
    //400 i wiadomosc o bledzie
    console.log('do tego doszlo ?')
    //validacja przez dodaniem usera do bazy danych
    const emailExist = await UserModel.findOne({email:req.body.email});//szukam w bazie danych tego emaila
    if(emailExist) return res.status(400).send('Email already exist')//email istnieje to zwracam bład
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    //tworzenie nowego uzytkownika
    const user = new UserModel({
        email:req.body.email,
        password:hashedPassword,
        name:req.body.name
    })
    //próba dodania uzytkownika do bazy danych
    try{
        const savedUser = await user.save();//zapisuje usera do bazy danych
        // const token = jwt.sign({id:savedUser._id},process.env.TOKEN_SECRET,{expiresIn:'15s'});//tworze token
        // const refreshToken = jwt.sign({id:savedUser._id},process.env.REFRESH_TOKEN_SECRET); // wyslac to do uzytkownika
        // res.redirect('/auth/?path=/home&token='+ token+'&refreshToken='+refreshToken)
        createTokenAndRefreshToken_SendToUser(savedUser,res);
    }catch(err){
        console.log(err)
        res.status(400).send(err) 
    }
})

module.exports = route;