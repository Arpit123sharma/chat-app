import { Router } from "express";
import { fetchPendingMessages } from "../../Controllers/messageController/request.chat.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/pendingMessages").get(authMiddleware,fetchPendingMessages)

export default router