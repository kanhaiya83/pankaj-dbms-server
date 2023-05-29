import express from 'express'
import { editData,allEditedData ,rejectEdit,approveEdit} from '../controllers/updateDataControllers.js';
// import { isAdmin, isAuthenticatedUser } from '../middleware/auth.js';

const router=express.Router();

router.route('/:id').post(editData).patch(rejectEdit);
router.route('/allData').get(allEditedData);
router.route('/update/:id').patch(approveEdit);






export default router;   
