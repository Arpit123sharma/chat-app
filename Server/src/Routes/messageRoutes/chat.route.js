import { Router } from "express";
import { fileHandler } from "../../Controllers/messageController/chat.controller.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";
import { upload } from "../../Middlewares/multer.js";
const router = Router() 
router.route("/uploadFile").put(authMiddleware,upload.single("File"),fileHandler)

export default router