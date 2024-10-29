import express from 'express';
import {
  addToCart,
  getCart,
  getUserCart,
  removeCart,
  validateAddtoCart
} from '../controller/cartController.js';

const router = express.Router();

/**
 * @swagger
 * /cart/addToCart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product to add to the cart
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to add
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartItem:
 *                   type: object
 *                 product:
 *                   type: object
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       409:
 *         description: Insufficient quantity available
 *       500:
 *         description: Server error
 */
router.post('/addToCart', validateAddtoCart, addToCart);

/**
 * @swagger
 * /cart/carts:
 *   get:
 *     summary: Get all cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Cart is empty
 *       500:
 *         description: Server error
 */
router.get('/carts', getCart);

/**
 * @swagger
 * /cart/remove/{id}:
 *   delete:
 *     summary: Remove a product from the cart by ID
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to remove from the cart
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted:
 *                   type: integer
 *       404:
 *         description: No product found with the given ID
 *       500:
 *         description: Server error
 */
router.delete('/remove/:id', removeCart);

/**
 * @swagger
 * /cart/user/{id}/cart:
 *   get:
 *     summary: Get cart items for a specific user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to fetch cart items for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartItems:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: User not available
 *       400:
 *         description: Cart is empty
 *       500:
 *         description: Server error
 */
router.get('/user/:id/cart', getUserCart);

export default router;
