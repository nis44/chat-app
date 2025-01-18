import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessages } from "../controller/message.controller.js";

const router = Router();

router.route("/get-users").get(verifyJWT, getUserForSidebar);

router.route("/get-messages/:id").get(verifyJWT, getMessages);

router.route("/send-messages/:id").post(verifyJWT, sendMessages)


export default router;
