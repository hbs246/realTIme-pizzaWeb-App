require('dotenv').config();
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore= require('connect-mongo')(session);
const passport = require('passport');
const Emitter = require('events');
const app = express();

const PORT = process.env.PORT  || 3000;


// Data Base Connection
const url = "mongodb://localhost/pizza";
mongoose.connect(url,{ 
                       useNewUrlParser    : true , 
                       useCreateIndex     : true, 
                       useUnifiedTopology : true ,
                       useFindAndModify   : true    
                    }
                );
const connection = mongoose.connection;
connection.once('open',()=>{

      console.log('Database Connected ...');
}).catch(err =>{
    console.log('Connection Failed ...')
});

// Flash Connection
app.use(flash());
//Assets
app.use(express.static('public'));

app.use(express.urlencoded({ extended : false }));
/// Enabel the all the json request and response.
app.use(express.json());


// Session Store
let mongoStore = new MongoDbStore({

    mongooseConnection : connection,
    collection : 'sessions'

})
;
// Event Emitter Setup;

const eventEmitter = new Emitter();

app.set('eventEmitter',eventEmitter);
// Session Config
app.use(session({

      secret : process.env.COOKIE_SECRET,
      resave : false,
      store : mongoStore,
      saveUninitialized : false,
      cookie : {maxAge : 1000 * 60 * 60 * 24} // 24 hours

}));

// Passport Config

const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());




// Global Middleware

app.use((req,res,next) => {

    res.locals.session = req.session;
    res.locals.user = req.user;
    ///res.locals.orders = req.orders;
    next();
});
// Set the template engine

app.use(expressLayout);
app.set('views', path.join(__dirname ,'/resources/views'));
app.set('view engine','ejs');

// Call the Routes Function

require('./routes/web')(app);  // Here Direct call the function of initRoutes

// Start The Server

const server = app.listen(PORT,()=>{
    console.log(`Server Listening on port ${PORT}`);
});

// Socket Connection 

const io = require('socket.io')(server);

io.on('connection',(socket) => {

    // Join
    socket.on('join',(orderId) => {
        socket.join(orderId);
    })
});

eventEmitter.on('orderUpdated',(data) => {
    io.to(`order_${data.id}`).emit('updateOrder',data);
});

eventEmitter.on('orderPlaced',(data) => {

    console.log('hi harshil');
    
    console.log(data);
    
    io.to('adminRoom').emit('orderAPlaced',data);
})