import { Router } from "express";
import { creatPlayList, getUserPlaylists,getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


router.route("/").post(verifyJWT,creatPlayList)
router.route("/").get(verifyJWT,getUserPlaylists)
router.route("/:playListId").get(verifyJWT,getPlaylistById)
router.route("/:playListId/videos").post(verifyJWT,addVideoToPlaylist)
router.route("/:playListId/videos/:videoId").delete(verifyJWT,removeVideoFromPlaylist)
router.route("/:playListId").delete(verifyJWT,deletePlaylist)



export default router