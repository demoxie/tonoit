import {Request,Response,NextFunction} from 'express'
import User from '../models/user_model'
import IUser from '../interfaces/dtos'
import bcrypt from 'bcrypt'
import sendEmail from '../services/mail'
import templates from '../templates/email_template'
import auth from '../middleware/auth'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()



const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const salt = await bcrypt.genSalt(10)
  const {name,gender,email,password} =req.body
  const hashedPassword: string = await bcrypt.hash(password , salt)
  // const obj: IUser = {name:name,gender:gender,email:email,password:hashedPassword}
  const user = new User({name:name,gender:gender,email:email,password:hashedPassword})

  let accessToken: string = auth.getToken(user)


  let refreshToken: string = auth.getRefreshToken(user)
  

  user.confirmation = uuidv4()
  const data = await user.save()
  if (data === null) {
    res.status(500).json()
  }
  const html = await templates(accessToken)
  const sent = await sendEmail(email, 'Account confirmation', html)
  if (sent) {
    res.status(201).json({
      message: 'Account sent check your email inbox to verify your account',
      data: data,
    })
    //send the access token to the client inside a cookie
    res.cookie('jwt', accessToken, { secure: true, httpOnly: true })
    res.status(206).json({ message: 'Failed to send email','data':data })
  } else {
    res.status(206).json({ message: 'Failed to send email','data':data })
  }
}
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
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
  createUser,
  loginUser,
}
