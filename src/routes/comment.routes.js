import { Router } from "express";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();
router.route("/video/:videoId").post(verifyJWT,addComment).get(getVideoComment)
router.route("/:commentId").patch(verifyJWT,updateComment).delete(verifyJWT,deleteComment);


export default router