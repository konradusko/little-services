//validation
const Joi = require("@hapi/joi");
const jwt = require('jsonwebtoken')
const fs = require('fs');
const UserModel = require('./model/User');
//validacja do rejestracji
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}
//validacja do logowania
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}
//Authorization check
const isUserAuthorization = (req, res, page) => {
    // console.log(req.body)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    // console.log(token)
    if (token == "null" || token == null) {
        //nie mamy tokena to na '/login
        return res.json({
            error: {message:'TokenNull'}
        });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, async(err, user) => {
        if (err) return res.json({
            error: err
        }); //token sie nie zgadza trzeba bedzie usunac stary 
        const userFromDB = await UserModel.findOne({_id:user._id});//szukam w bazie danych tego uzytkonwika
        fs.readFile('views/'+page, "utf-8", (err, temp) => {
            //wysylam templatke i usera
            res.json({
                error: false,
                template: temp,
                user: userFromDB.name
            })
        })
    })
}
const createTokenAndRefreshToken_SendToUser = (user, res) => {
    console.log('tworze token z tego ')
    console.log(user)
    const token = jwt.sign({
        _id:user.id
    }, process.env.TOKEN_SECRET, {
        expiresIn: '15s'
    }); //tworze token
    const refreshToken = jwt.sign({
        _id:user.id
    }, process.env.REFRESH_TOKEN_SECRET); // wyslac to do uzytkownika
    /// dodac refresh token do bazdy danych
    res.redirect('http://localhost:3000/auth/?token=' + token + '&refreshToken=' + refreshToken)
}

module.exports = {
    registerValidation,
    loginValidation,
    isUserAuthorization,
    createTokenAndRefreshToken_SendToUser,
}