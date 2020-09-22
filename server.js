const express = require('express');
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');

const app = express();

const PORT = process.env.PORT  || 3000;


//Assets
app.use(express.static('public'));
// Set the template engine

app.use(expressLayout);
app.set('views', path.join(__dirname ,'/resources/views'));
app.set('view engine','ejs');

// Routes Page 
app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/cart",(req,res)=>{
    res.render('customers/cart.ejs');
});
app.get('/login',(req,res)=>{
    res.render('auth/login.ejs');
});
app.get('/register',(req,res)=>{
    res.render('auth/register.ejs');
});

// Start The Server
app.listen(PORT,()=>{
    console.log(`Server Listening on port ${PORT}`);
});
