import User from '../models/User.js'
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import sendToken from '../utils/sendToken.js';

// register user

const signupUser =catchAsyncError(async (req,res,next)=>{
    const {name,email,password,role}=req.body;
    if(!name || !email || !password){
        return next(new ErrorHandler("please provide all values",400))
    }
    const userAlreadyExists= await User.findOne({email});
    if(userAlreadyExists){
        return next(new ErrorHandler("Email already in exist",400))   
    }
    const user=await User.create({name,email,password,role})
    
    sendToken(user,201,res);
    
})
// login User
// User.find({}).select("+password").then(console.log)
const loginUser =catchAsyncError(async(req,res,next)=>{

    const {email,password}=req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400));
    }

    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid  Email or Password",401))
    }
    const verifyPassword=await user.comparePassword(password);
    
    if(!verifyPassword){
        return next(new ErrorHandler("Invalid  Email or Password",401))
    }
    
    sendToken(user,200,res);


})

// logoutUser
const logoutUser =catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    
    
    res.status(200).json({
        success:true,
        message:"Logged Out Successfully"
    })

})
// get currUser
const getCurrentUser=catchAsyncError(
    async(req,res,next)=>{
        const {_id}=req.user
        const user = await User.findOne({ _id });
        res.status(200).json({ user });
    }
)
//admin->delete user
const deleteUser =catchAsyncError(async(req,res,next)=>{
   
    const {id}=req.params;
    const user =await User.findOne({_id:id});

    if(!user){
        next(new ErrorHandler("User does not exit",404));
    }
   await User.deleteOne({_id:id});
   const users =await User.find();
    res.status(200).json({
        success:true,
        users,
        message:"user deleted successfully"
       })
    
})

//admin-> update Role
const updateUserRole =catchAsyncError(async(req,res,next)=>{
   
    const {id}=req.params
    const user= await User.findOneAndUpdate({_id:id},req.body,{
        new:true,
        runValidators:true
    })
    const users =await User.find();
    res.status(200).json({
        success:true,
        users
    })
   
})
//admin->get all user
const getAllUser = catchAsyncError(async (req,res,next) => {

    const users =await User.find();
      
    res.status(200).json({
      success:true,
      users
    })
})

export  {signupUser,loginUser,logoutUser,deleteUser,updateUserRole,getAllUser,getCurrentUser};