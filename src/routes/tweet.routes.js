import { Router } from "express";
import { creatTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/").post(verifyJWT,creatTweet)



export default router;