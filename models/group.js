const mongoose=require('mongoose');
const Joi=require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)


const groupSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    name:{
        type:String,
        required:true,
        maxlength:50,
        trim:true
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{
    timestamps:true
});


const Group=mongoose.model('Group',groupSchema);

function validateGroup(group) {
    const schema=Joi.object({
        owner:Joi.objectId(),
        members:Joi.objectId(),
        name:Joi.string().max(50).required()
    });
    return schema.validate(group);
}




module.exports.Group=Group;
module.exports.validate=validateGroup;