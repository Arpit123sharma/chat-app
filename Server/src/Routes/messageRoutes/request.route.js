import { Router } from "express";
import { sendingRequestToConnect } from "../../Controllers/messageController/request.chat.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/portNum").get(authMiddleware,sendingRequestToConnect)

export default router