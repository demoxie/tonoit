import * as mongoose from 'mongoose';
import IUser from '../interfaces/index'
const Schema = mongoose.Schema;

let User = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
   gender: { type: String, required: [true, 'gender is required'] },
  email: {
    type: String,
    unique: [true, 'email already exists in database!'],
    required: [true, 'email not provided']
  },
  password: { type: String, required: [true, 'password is required'] },
 
  confirmation: { type: String, default: '' },
  enabled: { type: Boolean, default: false },
  cart: [{ type: Schema.Types.ObjectId,ref:'Product'}]
  
},
{
    timestamps: true
});

export default mongoose.model<IUser>('User', User)
