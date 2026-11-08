import { Router } from "express";
import {
    toggleVideoLike,
    toggleComentLike,
    toggleTweetLike,
    getlikedVideos
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/video/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/comment/:commentId").post(verifyJWT, toggleComentLike);
router.route("/tweet/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/liked-videos").get (verifyJWT,getlikedVideos)
export default router;