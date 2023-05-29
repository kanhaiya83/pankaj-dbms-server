import mongoose from "mongoose";

const mainDataSchema = new mongoose.Schema({
  dri_id: { type: String, default: "" },
  place: { type: String, default: "" },
  appNumber: { type: String, default: "" },
  company: { type: String, default: "" },
  membership_type: { type: String, default: "" },
  date: { type: String, default: "" },
  amc: { type: String, default: "" },
  customerName: { type: String, default: "" },
  GSV: { type: Number, default: 0 },
  CSV: { type: Number, default: 0 },
  deposit: { type: String, default: "" },
  status: { type: String, default: "" },
  currentValue: { type: String },
  remarks: { type: String, default: "" },
});

export default mongoose.model("MainData", mainDataSchema);
