import {Document} from 'mongoose'
import {Request,Response,NextFunction} from 'express'
export default interface IUser extends Document{
    _id?: string
    name: string;
    gender: string;
    email: string;
    password: string;
    confirmation?: string;
    enabled?: boolean;
}
export interface IProduct extends Document{
    name: string;
    type: string;
    price: number;
    quantity: number;
    description: string;
}
export interface user extends Request{
    user: IUser
}