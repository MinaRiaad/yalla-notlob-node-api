const {SubOrder}=require('../models/subOrder.js');


module.exports= async function (req,res,next) {
    await SubOrder.find({order:req.params.id}).remove().exec();
    next();
}