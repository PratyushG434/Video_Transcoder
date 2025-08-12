import express from "express";
import { addNewUser } from "../controllers/userController.js";
import { uploadVideoRequest } from "../controllers/uploadVideoController.js";
import { getVideos , getUserVideos} from "../controllers/videoController.js";

const router = express.Router();


router.post("/newUser" , addNewUser)
router.get("/getAllVideos" , getVideos)
router.post("/getAllUserSpecificVideos" , getUserVideos)  // issi me pending vali bhi dikha dege - upload krne ke baad bol dege profile pr jake check kro
router.post("/uploadVideoRequest" , uploadVideoRequest)


export default router;