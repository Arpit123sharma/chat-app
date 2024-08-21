import { Router } from "express";
import { fetchPendingMessages , readPendingMessage} from "../../Controllers/messageController/request.chat.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/pendingMessages").get(authMiddleware,fetchPendingMessages)
router.route("/readPendingMessages/:friendsID").get(authMiddleware,readPendingMessage)

export default router