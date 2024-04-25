import { Router } from "express"
import { registerUser } from "../Controllers/registerUser.auth.js"
import { upload } from "../Middlewares/multer.js"
import { forgetPassword, loginInUser, otpVerification, regenerateAccessToken } from "../Controllers/LoginIn.auth.js"
import {authMiddleware} from "../Middlewares/Auth.middleware.js"
import { changePassword, deleteAccount, logoutUser, updateUser } from "../Controllers/manageUser.js"


const router = Router()
// gneral routing
router.route("/register").post(upload.single("profile"),registerUser) // signup
router.route("/login").post(loginInUser)// login make session
router.route("/otpVerification").post(authMiddleware,otpVerification) // login 2 step verification (otp)
router.route("/regenerateToken").get(regenerateAccessToken)
router.route("/forgetPassword").post(forgetPassword)

// profile edit routes

router.route("/updateUser").put(authMiddleware,updateUser)
router.route("/changePassword").patch(authMiddleware,changePassword)

//logout and Delet user

router.route("/logout").get(authMiddleware,logoutUser)
router.route("/deleteAccout").delete(authMiddleware,deleteAccount)

export default router