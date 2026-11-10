import { Router } from "express";
import { creatTweet, deleteTweet, getAllTweet, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/").post(verifyJWT,creatTweet)
router.route("/").get(verifyJWT,getAllTweet)
router.route("/:tweetId").patch(verifyJWT,updateTweet)
router.route("/:tweetId").delete(verifyJWT,deleteTweet)



export default router;