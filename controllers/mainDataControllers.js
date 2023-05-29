import catchAsyncError from "../middleware/catchAsyncError.js";
import MainData from "../models/MainData.js";
import XLSX from "xlsx";
import UpdateData from "../models/UpdateData.js";
const upload = catchAsyncError(async (req, res,) => {
  try {
    const file = req.file;
    const workbook = XLSX.readFile(file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    console.log("Converting to json!");
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log("Success!");

    // Insert the data in batches
    const batchSize = 500;
    let batchData = [];
    let insertedCount = 0;
    let temp = 0;
    if (jsonData) {
      for (const row of jsonData) {
        temp += 1;
        // if (temp > 105) {
        //   break;
        // }
        console.log(temp);

        const documentData = {
          dri_id: row["DRI-ID"],
          place: row["Place"],
          appNumber: row["APP No."],
          company: row["Company"],
          membership_type: row["Membership\nType"] ||  row["Membership Type"],
          amc: row["AMC"],
          customerName: row["CUSTOMER NAME"],
          GSV: row[" GSV "],
          CSV: row[" CSV "],
          deposit: row[" Deposit "],
          status: row["Status"],
          currentValue: row["Current Value "],
          remarks: row["Remarks"],
          date: `${row["Year Of Purchase"]}-${row["PP D"]}-${row["A"]}`.replaceAll("/","")
        };

        batchData.push(documentData);

        if (batchData.length === batchSize) {
    console.log("Inserting batch!");

          await MainData.insertMany(batchData);
          insertedCount += batchData.length;
          batchData = [];
        }
      }

      // Insert any remaining documents in the batch
      if (batchData.length > 0) {
        await MainData.insertMany(batchData);
        insertedCount += batchData.length;
      }
    }
    // await MainData.updateMany({}, [
    //   {
    //     $set: {
    //       date: {
    //         $concat: ["$a", "$pp_d", "$year"],
    //       },
    //     },
    //   }
    // ]);

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      insertedCount: insertedCount,
    });

    // Update the documents in the collection
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while uploading the file",
    });
  }
});

const getDataList = catchAsyncError(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page number
    const limit = parseInt(req.query.limit) || 10; // Get the requested limit per page

    // Calculate the skip value based on the page number and limit
    const skip = (page - 1) * limit;

    // Fetch the data from the database using skip and limit
    const data = await MainData.find().skip(skip).limit(limit);

    // Get the total count of documents
    const totalCount = await MainData.countDocuments();
    let pageInfo = {
      page,
      pageLimit: limit,
      totalCount,
    };

    res.status(200).json({
      success: true,
      count: data.length,
      pageInfo,
      result: data,
    });
  } catch (err) {
    res.status(500).json({
      status: " failed",
      message: "Internal Server Error",
    });
  }
});

const getData = catchAsyncError(async (req, res, next) => {
  const { status, place, year, customerName, editStatus, dri_id, appNumber } =
    req.query;
  console.log(req.query);
  const queryObject = {};
  if (appNumber) {
    queryObject.appNumber = appNumber;
  }
  if (dri_id) {
    queryObject.dri_id = dri_id;
  }
  if (status && status !== "All") {
    queryObject.status = status;
  }
  if (place && place !== "All") {
    queryObject.place = place;
  }
  if (year) {
    queryObject.date = { $regex: year+"-", $options: "i" };;
  }
  if (customerName) {
    queryObject.customerName = { $regex: customerName, $options: "i" };
  }

  let result = await MainData.find(queryObject);
  // console.log(result);
  if (editStatus && editStatus !== "All") {
    const editDataRequest = await UpdateData.find();
    result = result.filter((data) =>
      editDataRequest.some((editData) => {
        // if(editStatus==='Not Seen'){
        //   console.log(String(data._id)!==String(editData.dataId));
        //   return String(data._id)!==String(editData.dataId)
        // }
        return (
          String(editData.dataId) === String(data._id) &&
          editData.status === editStatus
        );
      })
    );
  }

  res.status(200).json({
    success: true,
    result,
  });
});

// exports.readExcelFile = async (req, res) => {
//   try {
//   } catch (err) {
//     res.status(500).json({
//       message: "Internal Server Error",
//       err: err,
//     });
//   }
// };

export { upload, getData, getDataList };
