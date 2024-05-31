import { Router } from "express";
import { Searching } from "../../Controllers/searchController/search.controller.js";
import { authMiddleware } from "../../Middlewares/Auth.middleware.js";

const router = Router() 
router.route("/searchUsers").get(authMiddleware,Searching)

export default router

