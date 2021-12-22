const router = require("express").Router();
const paymentCtrl = require("../controllers/PaymentController");
const auth = require("../middleware/Auth");
const authAdmin = require("../middleware/AuthAdmin");

router
  .route("/payment")
  .get(auth, authAdmin, paymentCtrl.getPayments)
  .post(auth, paymentCtrl.createPayment);

module.exports = router;
