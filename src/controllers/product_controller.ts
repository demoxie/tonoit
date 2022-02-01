import {Request,Response,NextFunction} from 'express'
import Product from '../models/product_model'
import User from '../models/user_model'
import IUser from '../interfaces/dtos'
import IProduct from '../interfaces/dtos'
import bcrypt from 'bcrypt'
import sendEmail from '../services/mail'
import templates from '../templates/email_template'
import auth from '../middleware/auth'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()


const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const obj: IProduct = req.body
  const product = new Product(obj)
  const newProduct = await product.save((err, data) => {
      if(err){
          return res.status(403).json(err)
      }
      res.status(200).json(data)
  })
  

}
const addProductToCart = async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.headers.user;
    const product = Product.findById(req.params)
  const user = await User.findOneAndUpdate({ email: loggedInUser.email },
    {$push: {cart: product}},(err: any, result: any) => {
        if(err){
            return res.status(401).json(err)
        }
        res.status(200).json(result)
  }).exec()

}
const removeProductFromCart = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    const valid = await bcrypt.compare(req.body.password, user.password)
    if (valid) {
      // Create token
      const token = await auth.getToken(user)

      return res
        .status(200)
        .json({ message: 'login successful', token: token})
    }
    res.status(401).json({ message: 'Invalid password' })
  } else {
    res.status(500).json({ message: 'User does not exist' })
  }
}


export {
    createProduct,
  addProductToCart,
  removeProductFromCart,
}
