import { Router } from "express";
import { sendRequestToUser,cancelRequestFromUser,acceptRequestByUser, allRequestOfUser } from "../../Controllers/friendsController/request.controller.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/sendRequest/:requestTo").get(authMiddleware,sendRequestToUser)
router.route("/cancelRequest/:user/:requestTo").get(authMiddleware,cancelRequestFromUser)
router.route("/acceptRequest/:requestFrom").get(authMiddleware,acceptRequestByUser)
router.route("/AllRequests").get(authMiddleware,allRequestOfUser)

export default router