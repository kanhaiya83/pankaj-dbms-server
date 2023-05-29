import  jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxlength:[30,"name ca'nt exceed 4 character"],
        minlength:[4,"name should have more then 4 character"],
        trim:true,
    },
    email:{ 
        type:String,
        required:false, 
        unique:true,
        validate:[validator.isEmail,"please enter a valid email"],
    },
    password:{
        type:String,
        required:false, 
        minlength:[6,"password should have minimum 8 character"],
        select:false,
    },
    
    role:{
        type:String,
        default:"user",
        enum: ['admin', 'verifier', 'executive'],
        default:'executive',
    },
})

  // hashing the password
  userSchema.pre('save',async function(){
    if(!this.isModified('password')) return;
  
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
  
  })
  // create jwt token
  userSchema.methods.createJWT=function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
  }
  // compare password
  userSchema.methods.comparePassword= async function(givenPassword){
    const isMatch= await bcrypt.compare(givenPassword,this.password);
    return isMatch;
  }

  export default mongoose.model('User',userSchema);
 