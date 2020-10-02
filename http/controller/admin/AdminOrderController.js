
const orders = require('../../../app/models/order');

function AdminOrderController(){

    return{

        index(req,res){

            orders.find( { status : { $ne : 'completed'}} , null , 
                         { sort: { 'createdAt': -1 }}).populate('customerId','-password').exec((err , orders) => {

                              if(req.xhr){
                                  return res.json(orders);
                              }
                              return res.render('admin/orders');
                         });

        }
    }
}

module.exports = AdminOrderController;