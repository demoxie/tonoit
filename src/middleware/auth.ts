import {Request,Response,NextFunction} from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '../models/user_model'
import bcrypt from 'bcrypt'
import sendEmail from '../services/mail'
import templates from '../templates/email_template'
import IUser from '../interfaces/index'
dotenv.config()
// const { DB_HOST, DB_NAME,ACCESS_TOKEN_SECRET,ACCESS_TOKEN_LIFE} = process.env
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET||"SECRET"
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || 900000
const getToken = (user: IUser) =>
  jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_LIFE,
  })
const getRefreshToken = (user: IUser) =>
  jwt.sign({user}, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_LIFE,
  })

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  let token = (req.headers['token'] || '').toString()
  if (token === null)
    return res.status(403).json({ message: 'token not provided' })
  const newData = []
  const decode = jwt.verify(token,ACCESS_TOKEN_SECRET,
    (err: any, data: any) => {
      if (err) {
        return res.status(401).json(err)
      }
      req.headers.user = data
      next()
    },
  )
}

const verifyAccountToken = async (req: Request, res: Response, next: NextFunction) => {
  let token: string= req.params.token
  if (token === null)
    return res.status(403).json({ message: 'token not provided' })
  const newData: any[] = []
  const decode = jwt.verify(
    token,
    ACCESS_TOKEN_SECRET,
    (err: any, doc: any) => {
      if (err) {
        return res.status(401).json(err)
      } else {
        return newData.push(doc)
      }
    },
  )
  let verifyUser = newData[0].email
  if (!verifyUser.enabled) {
    const registeredUser = User.findOne(
      {
        email: verifyUser.email,
      },
      (err:any, oldUser:any) => {
        if (err) {
          return res
            .status(404)
            .json({ message: 'User not found or account activated already' })
        }
        oldUser.confirmation = ''
        oldUser.enabled = true
        oldUser.save((err:any, data:any) => {
          if (err) {
            res.status(409).json(err)
          }
          res.status(200).json({ message: 'Account activated successfully' })
        })
      },
    )
  } else {
    res.status(403).json({ message: 'Account activated already' })
  }
}
const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
  let accessToken: boolean =req.headers['authorization'] === ACCESS_TOKEN_SECRET

  if (!accessToken) {
    return res.status(403).send('A token is required for authentication')
  }
  try {
    next()
  } catch (err) {
    return res.status(401).send('Invalid Token')
  }
}
export default {
  getToken,
  verifyToken,
  verifyAccountToken,
  getRefreshToken,
  verifyApiKey,
}
