const mongoose=require('mongoose');
const Joi=require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)
const _=require('lodash');


const orderSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Restaurant',
        required:true,
    },
    status:{
        type:String,
        enum:['Waiting','Finished'],
        default:'Waiting'
    },
    meal:{
        type:String,
        enum:['Breakfast','Launch','Dinner'],
        required:true
    },
    joined_users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    invited_users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],
    subOrders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubOrder'
    }]
},{
    timestamps:true
});

const Order=mongoose.model('Order',orderSchema);

function validateOrder(order) {
    const schema=Joi.object({
        restaurant:Joi.objectId().required().label("restaurant"),
        invited_users:Joi.objectId().required().label("invitation"),
        status:Joi.string().valid('Waiting','Finished'),
        meal:Joi.string().valid('Breakfast','Launch','Dinner').required(),
    });
    return schema.validate(order);
}


module.exports.Order=Order;
module.exports.validate=validateOrder;