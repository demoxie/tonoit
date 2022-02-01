'use strict'
let nodemailer  = require('nodemailer')
const {SMTP_HOST,SMTP_PORT,GMAIL_PASSWORD,GMAIL_USERNAME} = process.env
import dotenv from 'dotenv'
dotenv.config()
const sendEmail = async (email: String, subject: String, template: String): Promise<boolean> => {
  

  let testAccount = await nodemailer.createTestAccount()

  let transporter = nodemailer.createTransport({
    services: 'GMAIL',
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: GMAIL_USERNAME,
      pass: GMAIL_PASSWORD,
    },
    debug: true,
    logger: true,
  })

  // send mail with defined transport object
  let info = await transporter.sendMail(
    {
      from: process.env.MAIL_SENDER, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: template, // html body
    },
    (error: any, response: Response) => {
      if (error) {
        console.log(error)
        return false
      } else {
        console.log('Message sent: %s', info.messageId)
        console.log(response)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
        return true
      }
    },
  )
  return false
}

export { sendEmail as default }
