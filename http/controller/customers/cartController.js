function cartController(){
 
    return {
        
        index(req,res){          
            res.render('customers/cart.ejs');
        },
        update(req , res){

            if(!req.session.cart){

                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart;
           
            const cartId = cart.items[req.body._id];
            
            if(!cartId){
               cart.items[req.body._id] = {item: req.body, qty:1}
               cart.totalQty += 1;
               cart.totalPrice += req.body.price;
               
               
            }else{

                cart.items[req.body._id].qty += 1;
                cart.totalQty += 1;
                cart.totalPrice += req.body.price;
            }
             const eventEmitter = req.app.get('eventEmitter');
             eventEmitter.emit('pizzaCart',cart);
            return res.json({ cart : cart});
        }
    }
}

module.exports = cartController;