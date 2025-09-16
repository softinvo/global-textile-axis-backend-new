const Product = require("../../models/products.model");
const { productSchema } = require("../../schemaValidator/product.validator");

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const validateReqBody = await productSchema.validateAsync(req.body);

    const product = new Product({
      seller: req.sellerId, // assuming userId is set from auth middleware
      ...validateReqBody,
      createdBy: "seller", // can be "admin" or "system" if needed
    });

    await product.save();
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Particular Seller Products
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.sellerId });
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Get Seller Products Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Get Product Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.userId },
      { $set: req.body },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not authorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.userId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not authorized",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
