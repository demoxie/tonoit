import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

let Receipt = new Schema({
    receipt_no: { type: String},
    client:{
        type:Schema.Types.ObjectId,
        ref: 'User.id'
    },
    payment_method:{
        type: String, required: [true, 'Payment method is required'],default: 'paypal'
    },
    items:[{
        type:Schema.Types.ObjectId,
        ref: 'Product'
    }],
    currentcy:{
            type: String,
            default: "USD"
        },
    amount: {
            type: Number,
            default: 0.00
        },
    description: {
        type: String
    },
  createAt: { type: Date, default: Date.now() },
  modifiedAt: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('Receipt', Receipt)
