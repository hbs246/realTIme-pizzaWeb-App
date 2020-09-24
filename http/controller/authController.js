const User = require('../../app/models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');
function authController() {

    return {

        login(req, res) {
            res.render('auth/login.ejs');
        },

        userLogin(req,res,next)
        {
           // validating the user 
           const {email , password} = req.body;
           if(!email || !password){

               req.flash('error','All fields are required');
               return res.redirect('/login');
           }

          passport.authenticate('local',(err,user,info)=>{

            if(err){
                req.flash('error',info.message);
                return next(err);
            }
            else if(!user){

                req.flash('error',info.message);
                return res.redirect('/login');
            }
            req.logIn(user , err =>{
                if(err){

                    req.flash('error',info.message);
                    return next(err);
                }
                return res.redirect('/');
            });
          })(req,res,next);
        },
        register(req, res) {
            res.render('auth/register.ejs');
        },
        async userRegister(req, res) {

            const { name, email, password } = req.body;

            // Validation Request 
            if (!name || !email || !password) {

                req.flash('error', 'All fields are required ');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register');
            }

            // Check if user exists 

            User.exists({ email: email }, (err, user) => {

                if (user) {

                    req.flash('error', 'User all ready exists!');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }
            });
            // Hash the password
            const hashedPassword = await bcrypt.hash(password,10);
            const user = new User({

                name,
                email,
                password: hashedPassword
            });
            // Create User
            user.save().then(user=>{

                // Login

                return res.redirect('/');
            }).catch(err=>{
                req.flash('error','Something went wrong ');
                return res.redirect('/register');
            });
        },
        logout(req,res){

            req.logout();
            //req.flash('logOut','You are logout successfully. ')
            return res.redirect('/');
        }
    }
}

module.exports = authController;