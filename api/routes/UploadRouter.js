const router = require("express").Router();
const uploadImage = require("../middleware/ImageUpload");
const uploadController = require("../controllers/UploadController");
const auth = require("../middleware/Auth.js");
const cloud = require("cloudinary");

router.post("/upload_profil", uploadImage, auth, uploadController.uploadProfil);
router.post("/destroy", (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      res.status(400).json({ msg: "Resim seçilmedi" });
    }
    cloud.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;
      res.json({ msg: "Resim Silindi" });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
