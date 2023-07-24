import nodemailer from  'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transport = nodemailer.createTransport({
    service: 'hotmail',
    secure: false,
    debug: true,
    secureConnection: false,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: true
    }
})

export const sendConfirmationEmail = (name, email, confirmationCode) => {
    console.log(`Sending confirmation email to: ${email} from ${process.env.EMAIL_USER}`)
    transport.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Please verify your e-mail address",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.BASE_ADDRESS}:3000/confirm/${confirmationCode}> Click here</a>
        </div>`
    }).catch(err => console.log(err))
}

