import { Router } from "express";
import { sendRequestToUser,cancelRequestFromUser,acceptRequestByUser } from "../../Controllers/friendsController/request.controller.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/sendRequest").get(authMiddleware,sendRequestToUser)
router.route("/cancelRequest").get(authMiddleware,cancelRequestFromUser)
router.route("/acceptRequest").get(authMiddleware,acceptRequestByUser)


export default router