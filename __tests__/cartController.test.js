import { addToCart, getCart, getUserCart, removeCart } from "../controller/cartController";

import { db } from "../dbConnection";

jest.mock("../dbConnection",()=>({
    db: {
        carts: {
            findOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            destroy: jest.fn(),
            save: jest.fn(),
        },
        products: {
            findOne: jest.fn(),
        },
        userDetails: {
            findOne: jest.fn(),
        },
    },
}))

let mockRequest = (body={},params = {}, user ={})=>({
    body,
    params,
    user
})

let mockResponse = ()=>{
    const res ={}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    return res
}

describe("add product to cart" , ()=>{
    it("should return 404 if validation fails",async()=>{
        const req = mockRequest({}, {}, {})
        const res = mockResponse()

        await addToCart(req,res)
        expect(res.status).toHaveBeenCalledWith(404)
    })

    it('should return 404 if product not found',async()=>{
        db.products.findOne.mockResolvedValue(null)

        const req = mockRequest({productId:1,quantity:1},{},{id:1})
        const res = mockResponse()

        await addToCart(req,res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message:"Product not found"})

    })

    it("should return 409 if product added to cart exceeds stock availability",async()=>{
        db.products.findOne.mockResolvedValue({productId:1,quantity:2},{},{id:1})

        const req = mockRequest({productId:1,quantity:3},{},{id:1})
        const res = mockResponse()

        await addToCart(req,res)
        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({message:"Only 2 products are available"})
    })

    it("should add product to cart",async()=>{
        db.products.findOne.mockResolvedValue({productId:1,quantity:10,save:jest.fn()})

        const req = mockRequest({productId:1,quantity:3},{},{id:1})
        const res = mockResponse()

        await addToCart(req,res)
        expect(db.carts.create).toHaveBeenCalledWith({
            productId:1,
            quantity:3,
            userId:1,

        })
        expect(res.status).toHaveBeenCalledWith(201);

    })
})


describe("get cart",()=>{
    it('should return 404 if cart is empty',async()=>{
        db.carts.findAll.mockResolvedValue([])

        const req = mockRequest()
        const res = mockResponse()

        await getCart(req,res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message:"Cart is empty"})

    })

    it('should return the grouped cart items', async () => {
        db.carts.findAll.mockResolvedValue([
          {
            productId: 1,
            quantity: 1,
            userId: 1,
            product: { title: 'Product 1', price: 100 },
            user: { userName: 'Test User' },
          },
        ]);
    
        const req = mockRequest();
        const res = mockResponse();
    
        await getCart(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          cartItems: [
            {
              userId: 1,
              userName: 'Test User',
              items: [
                {
                  productId: 1,
                  quantity: 1,
                  productDetails: { title: 'Product 1', price: 100 },
                },
              ],
            },
          ],
        });
      });

})


describe("delete from cart",()=>{
    it('should return 404 if cart is empty',async()=>{
        db.carts.findOne.mockResolvedValue(null)

        const req = mockRequest({},{id:1})
        const res = mockResponse()

        await removeCart(req,res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({message:"No product found with given id"})

    })
    it('should delete product if available',async()=>{
        db.carts.findOne.mockResolvedValue({id:1})
        db.carts.destroy.mockResolvedValue(1)

        const req = mockRequest({},{id:1})
        const res = mockResponse()

        await removeCart(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({message:"Product deleted",deleted:1})

    })
})

describe ("fetch user carts",()=>{
    it("should return the cart items of user",async()=>{
        db.carts.findAll([{
            productId:1,
            quantity:1,
            productDetails:{
                title:"product1",
                price:100
            },
            user: { 
                userName: "Test User"
            },
            userId: 1
        }])

        const req = mockRequest({},{id:1})
        const res = mockResponse()


        await getUserCart(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({message:"Cart fetched",cartItems:[
            {
              productId: 1,
              quantity: 1,
              product: { title: 'Product 1', price: 100 },
              userId: 1, 
                    user: { userName: "Test User" }
            },
          ],})
    })
})