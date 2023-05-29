import mongoose from "mongoose";


const updateDataSchema =new mongoose.Schema({
    dataId:{type:mongoose.Types.ObjectId,ref:"MainData"},
    dataToUpdate: { type: Object ,required:true},
    status: { type: String, enum: ['pending', 'approved', 'rejected'] ,required:true}
})

export default mongoose.model('UpdateData',updateDataSchema);