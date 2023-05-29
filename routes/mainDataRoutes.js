import express from "express";
import multer from "multer";
import {
  upload as uploadMainData,
  getData,
  getDataList,
} from "../controllers/mainDataControllers.js";
import MainData from "../models/MainData.js";
import UpdateData from "../models/UpdateData.js";
const router = express.Router();

// upload file middleware || multer
// storing the excel file in uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// router
router.get("/main",async(req,res)=>{
  res.send(await MainData.find({}))
})
router.get("/reset",async(req,res)=>{
  
await MainData.deleteMany({}).then(console.log);
await UpdateData.deleteMany({}).then(console.log);
res.send("success")
})
router.get("/update",async(req,res)=>{
  res.send(await UpdateData.find({}))
})
router.route("/upload").post(upload.single("file"), uploadMainData);
router.route("/getData").get(getData);
router.route("/getDataList").get(getDataList);

export default router;
