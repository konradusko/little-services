const route = require('express').Router();
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const {loginValidation,createTokenAndRefreshToken_SendToUser} = require('../validation');
const UserModel = require('../model/User');

route.post('/login', async(req,res)=>{
    const {error} = loginValidation(req.body);//sprawdzam validacje
    if(error) return res.status(400).send(error.details[0].message)
    //jesli error status 400 i wysylam wiadomosc o bledzie

    //sprawdzam czy uzytkownik pod takim emailem istnieje
    const userExist = await UserModel.findOne({email:req.body.email});
    if(!userExist) return res.status(400).send('User doesnt exist')

    //sprawdzam czy hasła sa takie same 
    const validPassword = await bcrypt.compare(req.body.password,userExist.password)
    if(!validPassword) return res.status(400).send('Invalid password')

    //stwórz token tutaj
    // const token = jwt.sign({id:userExist._id},process.env.TOKEN_SECRET,{expiresIn:'15s'});//tworze token

    //refresh token
    // const refreshToken = jwt.sign({id:userExist._id},process.env.REFRESH_TOKEN_SECRET); // wyslac to do uzytkownika
    createTokenAndRefreshToken_SendToUser(userExist,res)
    
    //i redirect do home page
    // res.send('succesfull')
})

module.exports = route;