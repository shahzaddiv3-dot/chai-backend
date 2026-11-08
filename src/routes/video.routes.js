import {Router} from "express";
import {publishVideo,getAllVideos, getVideoById, videoUpdate,  incrementVideoViews,togglePublishStatus, deleteVideo} from "../controllers/video.controller.js";
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
router.route("/:videoId").get(verifyJWT,getVideoById).patch(verifyJWT,upload.single("thumbnail"),videoUpdate)
router.route("/:videoId/views").patch(incrementVideoViews);
router.route("/:videoId/toggle-publish").patch(verifyJWT,togglePublishStatus);
router.route("/:videoId").delete(verifyJWT,deleteVideo)
export default router;