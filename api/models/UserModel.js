const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lutfen isim giriniz!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Lutfen e-mail giriniz!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Lutfen şifre giriniz!"],
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Array,
      default: [],
    },
    profile: {
      type: String,
      default:
        "https://res.cloudinary.com/umut44/image/upload/v1636734958/profil/default_jyq5ys.jpg",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
