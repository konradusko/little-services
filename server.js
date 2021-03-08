const express = require('express');
const app = express();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//rout import
const registerPage = require('./routes/register');
const loginPage = require('./routes/login');
const homePage = require('./routes/home');
const authPage = require('./routes/auth');
const homePageAfterLogin = require('./routes/homePageAfterLogin');
const notePadPage = require('./routes/notePad');
////
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
//
dotenv.config();
//view engine
app.set('view engine','ejs');
//
app.use(express.urlencoded({
    extended: false
}))
//middleware
app.use(express.json())// mozemy korzystac body w req
//connect to db
mongoose.connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true
},()=>{
    console.log("connect to DB !")
})
app.get('/register',registerPage)
app.get('/login',loginPage)
app.get('/',homePage);
app.get('/home',homePageAfterLogin)
app.post('/home',homePageAfterLogin)
app.get('/auth',authPage)
app.get('/notePad',notePadPage)
app.post('/notePad',notePadPage)
app.listen(3000,()=>{
    //dowiedziec sie roznice dlaczego tutaj http zrobilem
    console.log("Server running on port 3000")
})
