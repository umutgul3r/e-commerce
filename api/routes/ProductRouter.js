const router = require("express").Router();
const productController = require("../controllers/ProductController.js");

// Ürün işlemleri

router.get("/products", productController.getProducts);
router.post("/products", productController.createProduct);
router.delete("/products/:id", productController.deleteProduct);
router.put("/products/:id", productController.updateProduct);

// Yorum İşlemleri

router.post("/products/comment/:id", productController.commentProduct);
router.delete("/products/comment/:id", productController.deleteComment);

module.exports = router;
