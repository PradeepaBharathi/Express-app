import { check, validationResult } from "express-validator";
import { db } from "../dbConnection.js";

const products = db.products;

export const validateProduct = [
  check("title").notEmpty().withMessage("Title is required"),
  check("price")
    .notEmpty()
    .withMessage("Price is require")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  check("description").notEmpty().withMessage("Please fill the description"),
  check("image").custom((_, { req }) => {
    if (!req.files || req.files.length === 0) {
      throw new Error("Image file is required and must be valid");
    }
    return true;
  }),
];

export const validateUpdateProduct = [
  check("title").optional().notEmpty().withMessage("Title is required"),
  check("price")
    .optional()
    .notEmpty()
    .withMessage("Price is require")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("Please fill the description"),
];

export const addProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    if (!req.files) {
      return res
        .status(400)
        .send({ message: "Image file is required and must be valid" });
    }

    console.log(req.protocol);
    const fullUrl = req.files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    });
  
    let data = {
      id:req.body.id,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
   
      image: fullUrl,
      quantity:req.body.quantity
    };


    const existingProduct = await products.findOne({where:{id:data.id}})
    if(existingProduct){
      return res
        .status(409)
        .json({ message: "Product with same id exists" });
    }
    const product = await products.create(data);
    return res
      .status(201)
      .send({ message: "Product added successfully", product: product });
  } catch (error) {
    console.error("Error in addProduct:", error.message);
    return res.status(500).json({ message: "Server error", error:error.message });
  }
};

export const getallProducts = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    let allProducts = await products.findAll({});

    if (allProducts.length == 0) {
      return res.status(404).json({ message: "No Products found" });
    }
    return res.status(200).json(allProducts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  console.log("Route /list/:id hit");
console.log(req.params)
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  console.log(req.params)
  try {
    const productid = req.params.id;
    console.log(productid);

    const productParticular = await products.findOne({ where: { id: productid } });
    if (!productParticular) {
      return res
        .status(404)
        .json({ message: "No product found with given id" });
    }

    return res.status(200).json({ product: productParticular });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProductbyId = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const productid = req.params.id;
    console.log(productid);

    const productParticular = await products.findOne({ where: { id: productid } });
    if (!productParticular) {
      return res
        .status(404)
        .json({ message: "No product found with given id" });
    }

    let updateData = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      published: req.body.published || false,
      quantity:req.body.quantity
    };

    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    await products.update(updateData, { where: { id: productid } });

    const updatedProduct = await products.findOne({ where: { id: productid } });

    return res
      .status(201)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  try {
    const id = req.params.id;
    console.log(id);

    const productParticular = await products.findOne({ where: { id: id } });
    if (!productParticular) {
      return res
        .status(404)
        .json({ message: "No product found with given id" });
    }

    const deleteProduct = await products.destroy({ where: { id: id } });
    return res
      .status(200)
      .json({ message: "Producted deleted", deleted: deleteProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
