import { Router } from "express";
import { creatPlayList } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


router.route("/").post(verifyJWT,creatPlayList)



export default router