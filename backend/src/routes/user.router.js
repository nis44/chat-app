import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccesstoken, registerUser, updateAccountDetails, updateAvatar } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccesstoken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
    .route("/avatar")
    .patch(verifyJWT, upload.single("avatar"), updateAvatar);



export default router;