// const User = require('../../app/models/user');

// async function admin(req,res,next){
    
//     if(req.isAuthenticated()){
         
        
//         const user = await User.findOne({role:'admin'});
        
//         if(user.role === req.user.role){
//             return next();
//         }
//         return res.redirect('/');
//     }
//     return res.redirect('/');
    
// }

function admin (req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'admin') {
        return next()
    }
    return res.redirect('/')
}

module.exports = admin

// module.exports = admin;