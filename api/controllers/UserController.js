const Users = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./SendMail");
const { CLIENT_URL } = process.env;
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const Payments = require("../models/PaymentModel");

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ msg: "Lütfen bütün boşlukları doldurun" });
      }

      const user = await Users.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "Bu mail zaten kayıtlı" });
      }

      if (password.length < 6) {
        return res.status(400).json({ msg: "Sifre 6 karakterden uzun olmalı" });
      }

      if (!validateEmail(email))
        return res.status(400).json({ msg: "Gecersiz email" });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, email, password: passwordHash };

      console.log(newUser);

      const activation_token = createActivationToken(newUser);
      console.log(activation_token);

      const url = `${CLIENT_URL}/user/activate/${activation_token}`;
      sendMail(email, url, "Hesabını Etkinleştirebilirsin");

      res.json({
        msg: "Kayıt Başarılı Lütfen Mailinize Gelen Linkten Hesabınızı Aktif Ediniz.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );
      console.log(user);
      const { name, email, password } = user;
      const check = await Users.findOne({ email });
      if (check) return res.status(400).json({ msg: "Bu Email Zaten Alınmış" });
      const newUser = new Users({
        name,
        email,
        password,
      });
      await newUser.save();
      res.json({ msg: "Hesap Aktifleştirildi" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Böyle Bir Mail Yok" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Sifre Yanlıs" });
      const refresh_token = createRefreshToken({ id: user.id });
      const newLocal = "/user/refresh_token";
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: newLocal,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
      });
      res.json({ msg: "Giris Basarılı" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(500).json({ msg: "Lutfen Giris Yapın" });
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(4000).json({ msg: "Lutfen Giris Yapın" });
        const access_token = createAccessToken({ id: user.id });
        res.json({ access_token });
        console.log(user);
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Boyle Bir Email Yok" });
      const access_token = createAccessToken({ id: user.id });
      const url = `${CLIENT_URL}/user/reset/${access_token}`;
      sendMail(email, url, "Şifreni Sıfırlayabilirsin");
      res.json({
        msg: "Sifre Sıfırlama Baglantısı Email Adresinize Gonderildi",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      console.log(password);
      const passwordHash = await bcrypt.hash(password, 12);
      console.log(req.user);
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        { password: passwordHash }
      );
      res.json({ msg: "Sifre Basarı Ile Degistirildi " });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user)
        return res.status(400).json({ msg: "Kullanıcı Mevcut Değil." });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllUserInfo: async (req, res) => {
    try {
      console.log(req.user);
      const users = await Users.find().select("-password");
      res.json(users);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Cıkıs Basarılı" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, profile } = req.body;
      await Users.findOneAndUpdate({ _id: req.user.id }, { name, profile });
      res.json({ msg: " Güncelleme Basarılı" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;
      await Users.findOneAndUpdate({ _id: req.params.id }, { role });
      res.json({ msg: " Güncelleme Basarılı" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);
      res.json({ msg: "Silme Basarılı" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "Kullanıcı Mevcut Değil" });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Karta Eklendi" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });

      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });

      const { email_verified, email, name, picture } = verify.payload;

      const password = email + process.env.GOOGLE_SECRET;

      const passwordHash = await bcrypt.hash(password, 12);

      if (!email_verified)
        return res.status(400).json({ msg: "E-Posta Doğrulaması Basarısız" });

      const user = await Users.findOne({ email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Parola Hatalı." });

        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Giris Başarılı !" });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
          avatar: picture,
        });

        await newUser.save();

        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Gün
        });

        res.json({ msg: "Giris Basarılı!" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userController;
