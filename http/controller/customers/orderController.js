const moment = require('moment');
const Order = require('../../../app/models/order');
function orderController() {

    return {

        storeOrder(req, res) {

            const { phone, address } = req.body;

            if (!phone || !address) {

                req.flash('error', 'All fields are require ')
                return res.redirect('/cart');
            }
            const order = new Order({

                customerId: req.user._id,
                itmes: req.session.cart.items,
                phone,
                address
            })
            order.save().then(result => {

                Order.populate(result, { path: 'customerId' }, (err, orders) => {

                    if(err){
                        return res.redirect('/');
                    }
                    req.flash('success', 'Order placed successfully');
                    delete req.session.cart;

                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderPlaced', orders);

                    return res.redirect('/customers/orders');
                })

            }).catch(err => {
                req.flash('error', 'Something went wrong.')
                return res.redirect('/cart');
            });
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });
            res.render('customers/orders', { orders: orders, moment: moment });
        },
        async showOrderTrackingStatus(req, res) {

            const order = await Order.findById(req.params.id);

            // First Authorized User , user will entered either his own id or not

            if (req.user._id.toString() === order.customerId.toString()) {

                return res.render('customers/singleOrder', { order: order });
            }
            return res.redirect('/customers/orders');
        }
    }
}

module.exports = orderController;