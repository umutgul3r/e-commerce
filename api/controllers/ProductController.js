const Products = require("../models/ProductModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productController = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;

      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        seller_id,
        title,
        price,
        description,
        content,
        images,
        category,
        sellerName,
      } = req.body;
      if (!images) return res.status(400).json({ msg: "Fotograf Yuklenemedi" });

      const product = await Products.findOne({ product_id });
      if (product) return res.status(400).json({ msg: "Bu Urun Zaten Mevcut" });

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        seller_id,
        description,
        content,
        images,
        category,
        sellerName,
      });

      await newProduct.save();
      res.json({ msg: "Urun Olu??turuldu" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Urun Silindi" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) return res.status(400).json({ msg: "Fotograf Bulunamad??" });

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );

      res.json({ msg: "Urun Guncellendi" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  commentProduct: async (req, res) => {
    try {
      const random = Math.floor(Math.random() * 46884711);
      const id = String(random);
      const { comment, postUser } = req.body;
      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            comment: {
              id: id,
              comment: comment,
              postUser: postUser,
            },
          },
        }
      );
      console.log(postUser);
      res.json({ msg: " G??ncelleme Ba??ar??l??" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const umut = await Products.findOneAndUpdate(
        {
          "comment.id": req.params.id,
        },
        {
          $set: {
            "comment.$": {
              id: "",
              comment: "",
              postUser: "",
            },
          },
        }
      );
      console.log(umut);
      console.log(req.params.id);
      res.json({ msg: " G??ncelleme Ba??ar??l??" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productController;
