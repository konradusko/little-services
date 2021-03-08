const express = require('express');
const app = express();
const http = require('http').createServer(app);
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cors = require('cors');

//routes
const authRegister = require('./routesAuth/authRegister');
const authLogin = require('./routesAuth/authLogin');
const refreshToken = require('./routesAuth/refreshToken');
//connect toDB
mongoose.connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true
},()=>{
    console.log("connect to DB !")
})

//middleware
const corsOptions = {
    origin:'http://localhost:3000'

}
app.use(cors(corsOptions))
app.use(express.json())// mozemy korzystac body w req
app.use(express.urlencoded({
    extended: false
}))
//routers
app.post('/login',authLogin);
app.post('/register',authRegister);
app.post('/refreshToken',refreshToken);

//


http.listen(4000,()=>{
    //dowiedziec sie roznice dlaczego tutaj http zrobilem
    console.log("Server running on port 4000")
})