const express = require('express');
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');

const app = express();

const PORT = process.env.PORT  || 3000;

app.get("/",(req,res)=>{

    res.render("home.ejs");
});

// Set the template engine

app.use(expressLayout);
app.set('views', path.join(__dirname ,'/resources/views'));
app.set('view engine','ejs');

// Start The Server
app.listen(PORT,()=>{
    console.log(`Server Listening on port ${PORT}`);
});