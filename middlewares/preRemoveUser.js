const {Group}=require('../models/group');
const {Order}=require('../models/order');
const {SubOrder}=require('../models/subOrder');

module.exports= async function(req,res,next) {
    await Group.find({owner:req.user._id}).remove().exec();
    await Order.find({owner:req.user._id}).remove().exec();
    await SubOrder.find({owner:req.user._id}).remove().exec();
    next()
}