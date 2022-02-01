import * as mongoose from 'mongoose';
import IProduct from '../interfaces/index'
const Schema = mongoose.Schema;
let Product = new Schema({
    name: { type: String},
    type:{
        type: String
    },
    price: { type: Number},
    quantity: { 
        type: Number,

    },
    description: {
        type: String
    },
},{timestamps:true})

export default mongoose.model<IProduct>('Product', Product)
