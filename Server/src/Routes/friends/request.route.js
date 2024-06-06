import { Router } from "express";
import { sendRequestToUser,cancelRequestFromUser,acceptRequestByUser } from "../../Controllers/friendsController/request.controller.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/sendRequest/:requestTo").get(authMiddleware,sendRequestToUser)
router.route("/cancelRequest/:user/:requestTo").get(authMiddleware,cancelRequestFromUser)
router.route("/acceptRequest/:requestFrom").get(authMiddleware,acceptRequestByUser)


export default router