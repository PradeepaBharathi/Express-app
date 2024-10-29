import { check,validationResult } from "express-validator"
import { db } from "../dbConnection.js";
const carts = db.carts
const products = db.products

export const validateAddtoCart = [
    check("productId").notEmpty().withMessage("Product id is required"),
    check("quantity").notEmpty().withMessage("Please enter quantity ").isInt({gt:0}).withMessage("Quantity must be greater than 0")

]

export const addToCart = async(req,res)=>{
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).send({ error: errors.array() });
    }

    const {productId,quantity} = req.body
 

    try {
        const product = await products.findOne({where:{id:productId}})
        
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        if(quantity>product.quantity){
            return res.status(409).json({message:`Only ${product.quantity} products are available`})
        }

        product.quantity -= quantity
        await product.save()

        let cartItem = await carts.findOne({where:{productId : productId}})
        console.log(req.user)
      
        if(cartItem){
            cartItem.quantity += quantity
            await cartItem.save()
        }
        else{
            cartItem = await carts.create({
                productId:productId,
                quantity:quantity,
                userId: req.user.id
            })
        }
    
        return res.status(201).json({
            message: "Product added to cart",
            cartItem: cartItem,
            product: product,
            
          });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const getCart = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).send({ error: errors.array() });
    }

    try {
        
        const cartItems = await carts.findAll({
            include: [
                {
                    model: db.products,
                    attributes: ['id', 'title', 'price'],
                },
                {
                    model: db.usersDetails,
                    attributes: ['id', 'userName'],
                },
            ],
        });

      
        if (cartItems.length === 0) {
            return res.status(404).json({ message: `Cart is empty` });
        }

     
        const groupedCart = cartItems.reduce((acc, cartItem) => {
            const userId = cartItem.userId; 
            
            if (!acc[userId]) {
                acc[userId] = {
                    userId: userId,
                    userName: cartItem.user.userName, 
                    items: [],
                };
            }
            acc[userId].items.push({
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                productDetails: {
                    title: cartItem.product.title,
                    price: cartItem.product.price,
                },
            });
            return acc;
        }, {});

        return res.status(200).json({ cartItems: Object.values(groupedCart) });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const removeCart = async(req,res) =>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array() });
    }
    try {
        const id = req.params.id;
        console.log(id);
    
        const cartProduct = await carts.findOne({ where: { productId: id } });
        console.log(cartProduct)
        if (!cartProduct) {
          return res
            .status(404)
            .json({ message: "No product found with given id" });
        }
    
        const deleteProduct = await carts.destroy({ where: { productId: id } });
        return res
          .status(200)
          .json({ message: "Product deleted", deleted: deleteProduct });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}


export const getUserCart = async(req,res)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array() });
    }

    try {
        const userId = req.params.id
        const userCart = await carts.findAll({
            where: { userId: userId },
            include: [
                {
                    model: db.products, 
                    attributes: [ 'title', 'price'],                 }
            ]
        });

        if(!userId){
            return res.status(404).json({message:"User not available"})
        }
        if(userCart.length == 0){
            return res.status(400).json({message:"Cart is empty"})

        }
        
        return res.status(200).json({message:"Cart fetched", cartItems:userCart})

    } catch (error) {
        return res.status(500).json({ message: error.message });
        
    }
}