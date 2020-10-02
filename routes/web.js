const homeController = require('../http/controller/homeController');
const cartController = require('../http/controller/customers/cartController');
const authController = require('../http/controller/authController');
const guest = require('../http/middleware/guest');
const auth = require('../http/middleware/auth');
const orderController = require('../http/controller/customers/orderController');
const adminOrderController = require('../http/controller/admin/AdminOrderController');
const statusController = require('../http/controller/admin/statusController');
const admin = require('../http/middleware/admin');
//const order = require('../app/models/order');

function findAllRoutes(app)
{
     //Home Routes
     app.get("/",homeController().index);

     // Login Routes
     app.get("/login",guest,authController().login);
     app.post("/login",authController().userLogin);

     //Register Routes
     app.get("/register",guest,authController().register);
     app.post("/register",authController().userRegister)

     // Cart Routes
     app.get("/cart",cartController().index);
     app.post("/update-cart",cartController().update);

     //Logout Routes
     app.post('/logout',authController().logout);

     // Order Routes
     app.get('/customers/orders',auth,orderController().index);
     app.post('/orders',auth,orderController().storeOrder);
     app.get('/customers/orders/:id',auth,orderController().showOrderTrackingStatus);
     
     // Admin Routes
     app.get('/admin/orders',admin,adminOrderController().index);
     app.post('/admin/order/status',admin,statusController().updateStatus);
}

module.exports = findAllRoutes;