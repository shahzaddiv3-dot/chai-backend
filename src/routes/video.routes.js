import {Router} from "express";
import {publishVideo,getAllVideos, getVideoById, videoUpdate} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.route("/").post(
    verifyJWT,
    upload.fields([
        {
            name:"videoFile", maxCount:1
        },
        {name:"thumbnail", maxCount:1}
    ]),
    publishVideo
)
router.route("/").get(getAllVideos)
router.route("/:videoId").get(getVideoById).patch(verifyJWT,upload.single("thumbnail"),videoUpdate)
export default router;