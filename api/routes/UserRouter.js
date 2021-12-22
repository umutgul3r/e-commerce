const router = require("express").Router();
const userController = require("../controllers/UserController");
const auth = require("../middleware/Auth.js");
const authAdmin = require("../middleware/AuthAdmin.js");

router.post("/register", userController.register);
router.post("/activation", userController.activateEmail);
router.post("/login", userController.login);
router.post("/refresh_token", userController.getAccessToken);
router.post("/forgot", userController.forgotPassword);
router.post("/reset", auth, userController.resetPassword);
router.get("/info", auth, userController.getUserInfo);
router.get("/all_info", auth, authAdmin, userController.getAllUserInfo);
router.get("/logout", userController.logout);
router.patch("/update", auth, userController.updateUser);
router.patch("/update_role/:id", auth, userController.updateUserRole);
router.delete("/delete/:id", auth, userController.deleteUser);

router.patch("/addcart", auth, userController.addCart);
router.get("/history", auth, userController.history);

// Google Login

router.post("/google_login", userController.googleLogin);

module.exports = router;
