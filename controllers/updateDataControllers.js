import catchAsyncError from "../middleware/catchAsyncError.js";
import UpdateData from "../models/UpdateData.js";
import ErrorHandler from "../utils/errorHandler.js";
import MainData from "../models/MainData.js";

// executive
  const editData=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
   
    let data=await UpdateData.findOne({dataId:id});
    if(!data){
      data=await UpdateData.create({dataId:id,dataToUpdate:req.body,status:"pending"});
    }
    else{
      console.log("called");
      data.dataToUpdate={...data.dataToUpdate,...req.body};
      data.status="pending"
     await data.save();
    } 
  
    res.status(200).json({
        success:true,
        data, 
       
    })
  })
//   verifier
  const allEditedData=catchAsyncError(async(req,res,next)=>{
    
    const data=await UpdateData.find();

    res.status(200).json({
        success:true,
        data,
       
    })
  })
  const rejectEdit=catchAsyncError(async(req,res,next)=>{
    
    const {id}=req.params;
    const data=await UpdateData.findOne({dataId:id});

    if(!data){
        return next(new ErrorHandler("Data not found",404))
      } 
    
      const rejectedData=await UpdateData.findOneAndUpdate({dataId:id},{status:"rejected"},{
        new:true,
        runValidators:true
      })
      
    res.status(200).json({
        success:true,
        rejectedData, //approved
       
    })
  })
  const approveEdit=catchAsyncError(async(req,res,next)=>{
    const {id:editId}=req.params;
   
    const data=await MainData.findOne({_id:editId});
    if(!data){
      return next(new ErrorHandler("Data not found",404))
    }
    const editData= await UpdateData.findOne({dataId:editId});

    if(!editData){
        return next(new ErrorHandler("Data not found",404))
      }
    const updatedData=await MainData.findOneAndUpdate({_id:editId},editData.dataToUpdate,{
      new:true,
      runValidators:true
    })
    editData.status="approved"
    await editData.save();
    res.status(200).json({
        success:true,
        updatedData,
       
    })
  })


  

    export {editData,allEditedData,rejectEdit,approveEdit}