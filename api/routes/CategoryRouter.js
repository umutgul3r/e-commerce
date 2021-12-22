const router = require("express").Router();
const categoryController = require("../controllers/CategoryController");
const auth = require("../middleware/Auth");
const authAdmin = require("../middleware/AuthAdmin");

router
  .route("/category")
  .get(categoryController.getCategories)
  .post(auth, authAdmin, categoryController.createCategory);

router
  .route("/category/:id")
  .delete(auth, authAdmin, categoryController.deleteCategory)
  .put(auth, authAdmin, categoryController.updateCategory);

module.exports = router;
