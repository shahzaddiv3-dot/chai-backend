import { Router } from "express";
import { addComment, getVideoComment } from "../controllers/comment.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.route("/video/:videoId").post(verifyJWT,addComment).get(getVideoComment)



export default router