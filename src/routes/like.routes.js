import { Router } from "express";
import {
    toggeleVideoLike,
    toggelComentLike,
    toggleTweetLike
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/video/:videoId").post(verifyJWT, toggeleVideoLike);
router.route("/comment/:commentId").post(verifyJWT, toggelComentLike);
router.route("/tweet/:tweetId").post(verifyJWT, toggleTweetLike);

export default router;