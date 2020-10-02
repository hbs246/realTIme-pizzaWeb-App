const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
function init(){

    passport.use(new LocalStrategy({ usernameField : 'email'},(email , password , done)=>{
     

        // Login with email input 

        // Check if user exists 
        User.findOne({email : email}).then(user=>{

            if(!user){
                return done(null , false ,{message : 'No User With This Email Id.'})
            }
             // Comparing the password
            bcrypt.compare(password,user.password).then(match => {

                if(match){
                    return done(null , user , {message: 'Logged in Successfully'});
                }
                return done(null,false,{message: 'Username or Password is wrong'});
            }).catch(err =>{
                return done(null , false , {message : "Something Went Wrong"});
            });
           
        }).catch(err=>{
            return done(null,false,{message:'something went wrong'});
        });      
    }));

    // After Login we have to store user id in the session so that we can understand that user is login or not in the site.

    passport.serializeUser( (user,done ) =>{

        done(null, user._id);

    });

    passport.deserializeUser( (id , done) =>{

         User.findById(id , (err,user) => {

            done(err,user);
         });
    });

}

module.exports = init;