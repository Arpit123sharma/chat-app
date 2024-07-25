import { Router } from "express";
import { sendRequestToUser,cancelRequestFromReceiver,acceptRequestByUser, allRequestOfUser, cancelRequestFromSender } from "../../Controllers/friendsController/request.controller.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/sendRequest/:requestTo").get(authMiddleware,sendRequestToUser)
router.route("/cancelRequest/fromSender/:receiverID").get(authMiddleware,cancelRequestFromSender)
router.route("/cancelRequest/fromReceiver/:senderID").get(authMiddleware,cancelRequestFromReceiver)
router.route("/acceptRequest/:requestFrom").get(authMiddleware,acceptRequestByUser)
router.route("/AllRequests").get(authMiddleware,allRequestOfUser)

export default router