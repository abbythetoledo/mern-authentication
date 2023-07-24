import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken } from '../utils/generateToken.js';
import { v4 as uuidv4 } from 'uuid'
import { sendConfirmationEmail } from '../config/nodemailerConfig.js'

//@desc     Auth user/set token
//route     POST /api/users/auth
//@access   Public
const authUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email })

    if(user.regStatus == 'Active'){

        if(await user.matchPassword(password)) {
            generateToken(res, user._id)
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                regStatus: user.regStatus
            })       
        } else {
            res.status(401)
            throw new Error(`Invalid email or password`)
        }

    } else {
        res.status(401)
        throw new Error(`Please verify your e-mail`)
    }

    

})

//@desc     Register a new user
//route     POST /api/users/
//@access   Public
const registerUser = asyncHandler(async (req, res) => {

    const {name, email, password} = req.body

    const userExists = await User.findOne({ email })

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    const token = uuidv4().replace('-','')

    console.log(token)

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        confirmationCode: token
    })



    if(user) {

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            confirmationCode: user.confirmationCode,
            regStatus: user.regStatus
        })

        sendConfirmationEmail(user.name, user.email, user.confirmationCode)
        
        
    } else {
        res.status(400)
        throw new Error(`Invalid User Data`)
    }

})

//@desc     Log out user
//route     POST /api/users/logout
//@access   Public
const logoutUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({
        message: 'User logged out'
    })

})

//@desc     Get user profile
//route     GET /api/users/profile
//@access   Private
const getUserProfile = asyncHandler(async (req, res) => {

    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    res.status(200).json({
        user
    })
})

//@desc     Update user profile
//route     PUT /api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)

    if (user) {

        if (req.body.password) {

            if(await user.matchPassword(req.body.password)){

                user.name = req.body.name || user.name;
                user.email = req.body.email || req.body.email;
                
                if(req.body.changePassword) {
                    if(req.body.newPassword !== '') {
                        user.password = req.body.newPassword
                    } else {
                        throw new Error('Please enter your new password!')
                    }
                    
                } else {
                    user.password = req.body.password
                }
            } else {
                throw new Error('Wrong password!')
            }
            
        } else {
            throw new Error('Please enter your password!')
        }

        const updatedUser = await user.save()
        
        res.status(200).json({
            _id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            password: updatedUser.password
        })

    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const verifyUser = asyncHandler(async (req, res) => {
    console.log(req.params.confirmationCode)
    User.findOne({
        confirmationCode: req.params.confirmationCode,
    })
    .then((user) => {
        if(!user){
            return res.status(404).send({ message: "User not found"})
        }
        user.regStatus = 'Active'
        user.save()
    })
    .catch((e) => console.log("error", e))
    res.status(200).json({
        message: "Hi from the client"
    })
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    verifyUser
};