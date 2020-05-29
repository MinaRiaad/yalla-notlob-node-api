const {Order}=require('../models/order');

module.exports= async function(req,res,next) {
    await Order.find({restaurant:req.params.id}).remove().exec();
    next()
}