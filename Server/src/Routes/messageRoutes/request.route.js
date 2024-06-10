import { Router } from "express";
import { Searching } from "../../Controllers/messageController/request.chat.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/portNum").get(authMiddleware,Searching)

export default router