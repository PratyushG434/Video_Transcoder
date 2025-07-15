import express from "express";
import { generateUploadURL } from "../controllers/generateUploadUrl";
import { addNewUser } from "../controllers/userController";
import { uploadVideoRequest } from "../controllers/uploadVideoController";
import { getVideos , getUserVideos} from "../controllers/videoController";

const router = express.Router();

router.post('/upload-url', generateUploadURL)

router.post("/newUser" , addNewUser)
router.get("/getAllVideos" , getVideos)
router.post("/getAllUserSpecificVideos" , getUserVideos)  // issi me pending vali bhi dikha dege - upload krne ke baad bol dege profile pr jake check kro
router.post("/uploadVideoRequest" , uploadVideoRequest)


export default router;