import { Router } from "express";
import { userFriendList } from "../../Controllers/friendsController/friendList.controller.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/friendList").get(authMiddleware,userFriendList)

export default router