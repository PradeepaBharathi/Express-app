import {addProduct, deleteProductById, getallProducts, getProductById, updateProductbyId, validateProduct, validateUpdateProduct} from "../controller/productController.js";

import express from  'express'
import upload from "../middleware/multerMiddleware.js";

const router = express.Router()



/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The product ID
 *               title:
 *                 type: string
 *                 description: The product title
 *               price:
 *                 type: number
 *                 description: The product price
 *               description:
 *                 type: string
 *                 description: Product description
 *               quantity:
 *                 type: integer
 *                 description: Available quantity
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images (up to 5)
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: Product with the same ID exists
 *       500:
 *         description: Server error
 */

router.post("/add" ,upload.array("image",5),validateProduct, addProduct)



/**
 * @swagger
 * /product/list:
 *   get:
 *     summary: Get product list
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No product found
 *       500:
 *         description: Server error
 */
router.get("/list",getallProducts)
/**
 * @swagger
 * /product/list/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the product
 *                     title:
 *                       type: string
 *                       description: The product title
 *                     price:
 *                       type: number
 *                       description: The product price
 *                     description:
 *                       type: string
 *                       description: Product description
 *                     quantity:
 *                       type: integer
 *                       description: Available quantity
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: binary
 *                       description: Product images
 *       404:
 *         description: No product found with the provided ID
 *       500:
 *         description: Server error
 */
router.get("/list/:id", getProductById);
/**
 * @swagger
 * /product/edit/{id}:
 *   put:
 *     summary: Edit an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The product ID
 *               title:
 *                 type: string
 *                 description: The product title
 *               price:
 *                 type: number
 *                 description: The product price
 *               description:
 *                 type: string
 *                 description: Product description
 *               quantity:
 *                 type: integer
 *                 description: Available quantity
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images (up to 5)
 *     responses:
 *       201:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: Product with the same ID exists
 *       500:
 *         description: Server error
 */

router.put("/edit/:id",upload.array('image',5),validateUpdateProduct,updateProductbyId)
/**
 * @swagger
 * /product/delete/{id}:
 *   delete:
 *     summary: Delete a single product by ID
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delete a single product object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       404:
 *         description: No product found with the provided ID
 *       500:
 *         description: Server error
 */

router.delete("/delete/:id",deleteProductById)
export default router