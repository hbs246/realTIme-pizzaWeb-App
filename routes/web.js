const homeController = require('../http/controller/homeController');
const cartController = require('../http/controller/cartController');
const authController = require('../http/controller/authController');
const guest = require('../http/middleware/guest');
function findAllRoutes(app)
{
     
     app.get("/",homeController().index);
     app.get("/login",guest,authController().login);
     app.post("/login",authController().userLogin);
     app.get("/register",guest,authController().register);
     app.post("/register",authController().userRegister)
     app.get("/cart",cartController().index);
     app.post("/update-cart",cartController().update);
     app.post('/logout',authController().logout);
}

module.exports = findAllRoutes;