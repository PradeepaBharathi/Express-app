import { addProduct, deleteProductById, getallProducts, getProductById, updateProductbyId, validateProduct } from "../controller/productController";
import { db } from "../dbConnection";

jest.mock("../dbConnection",()=>({
    db: {
      
        products: {
            findOne: jest.fn(),
            create:jest.fn(),
            findAll:jest.fn(),
            update:jest.fn(),
            destroy:jest.fn()
        },
    },
}))

let mockRequest = (body={},params={},files=[])=>({
    body  ,
    params,
    files
})

let mockResponse = ()=>{
    const res ={}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)

    return res
}


describe("add product", () => {
   

    it("should return 400 if validation fails", async () => {
        const req = mockRequest({});
        const res = mockResponse();

        
        await validateProduct[0].run(req); 
        await validateProduct[1].run(req); 
        await validateProduct[2].run(req); 
        await validateProduct[3].run(req); 

        await addProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(400); 
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Array) }));
    });

    it("should return image is required",async()=>{
        const req = mockRequest({
            id:1,
            title:"product1",
            description:"this is product1",
            price:100,
            quantity:10
        })
        req.files = undefined;
        const res = mockResponse()

       await addProduct(req,res)

       expect(res.status).toHaveBeenCalledWith(400);
       expect(res.send).toHaveBeenCalledWith({ message: "Image file is required and must be valid" })
    })

    it("should return 409 if product already exists",async()=>{
        db.products.findOne.mockResolvedValueOnce({id:1})
 
 
         const req = mockRequest({
            id: 1,
            title: "Product 1",
            description: "This is product 1",
            price: 100,
            quantity: 10,
            files: [{ filename: "image1.jpg" }]
             })
         const res = mockResponse()
             
             await addProduct(req,res)
         expect(res.status).toHaveBeenCalledWith(409)
         expect(res.json).toHaveBeenCalledWith({message:"Product with same id exists"})
     })

     it("should add product successfully",async()=>{
        const newProduct ={
            id:1,
            title:"product1",
            description:"this is prooduct1",
            price:100,
            quantity:10,
            image: ["http://localhost/uploads/image1.jpg"]
        }

        db.products.findOne.mockResolvedValueOnce(null)
        db.products.create.mockResolvedValueOnce(newProduct)

        const req = mockRequest({
            body:{
                id:1,
                title:"product1",
                description:"this is prooduct1",
                price:100,
                quantity:10, 
            },
            files:[{filename:"image1.png"}]
        })

        const res = mockResponse()

        await addProduct(req,res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith({
            message: "Product added successfully",
            product: newProduct
        });
     })
     it("should return 500 if there is a server error", async () => {
        
        db.products.findOne.mockResolvedValueOnce(null);
        db.products.create.mockRejectedValueOnce(new Error("Database error")); 
    
        const req = mockRequest({
            body: {
                id: 1,
                title: "Product 1",
                description: "This is product 1",
                price: 100,
                quantity: 10
            },
            files: [{ filename: "image1.jpg" }] 
        });
    
        const res = mockResponse();
    
        await addProduct(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server error",
            error: "Database error"
        });
    });
})


describe("get product",()=>{
it("should return 404 if no products are available",async()=>{
    db.products.findAll.mockResolvedValueOnce([])
    const req = mockRequest()
    const res = mockResponse()

    await getallProducts(req,res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({message:"No Products found"})
})

it("should return all products",async()=>{
    db.products.findAll.mockResolvedValueOnce({
        id:1,
        title:"product1",
        description:"this is prooduct1",
        price:100,
        quantity:10,
        image: ["http://localhost/uploads/image1.jpg"]
    })

    const req = mockRequest()
    const res = mockResponse()

    await getallProducts(req,res)
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        id:1,
        title:"product1",
        description:"this is prooduct1",
        price:100,
        quantity:10,
        image: ["http://localhost/uploads/image1.jpg"]
    }); 
})
})


describe("get product by id" , ()=>{
    it("should return product details by ID", async () => {
        const mockProduct = {
            id: 1,
            title: "Product 1",
            description: "This is product 1",
            price: 100,
            quantity: 10,
            image: ["http://localhost/uploads/image1.jpg"]
        };
    
        db.products.findOne.mockResolvedValueOnce(mockProduct);
    
        const req = mockRequest({ params: { id: 1 } });
        const res = mockResponse();
    
        await getProductById(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ product: mockProduct });
    });
    
    it("should return 404 if no product found", async () => {
        db.products.findOne.mockResolvedValueOnce(null);
    
        const req = mockRequest({ params: { id: 1 } });
        const res = mockResponse();
    
        await getProductById(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No product found with given id" });
    });
    
})


describe("update product",()=>{
    it("should update a product by ID", async () => {
        const mockProduct = {
            id: 1,
            title: "Product 1",
            description: "This is product 1",
            price: 100,
            quantity: 10,
        };
    
        const updatedProduct = {
            ...mockProduct,
            title: "Updated Product 1",
        };
    
        db.products.findOne.mockResolvedValueOnce(mockProduct);
        db.products.update.mockResolvedValueOnce([1]); 
        db.products.findOne.mockResolvedValueOnce(updatedProduct); 
    
        const req = mockRequest({
            params: { id: 1 },
            body: { title: "Updated Product 1", price: 100, description: "Updated description", quantity: 10 },
            file: { filename: "updated_image.jpg" },
        });
        const res = mockResponse();
    
        await updateProductbyId(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    });
    
    it("should return 404 if no product found for update", async () => {
        db.products.findOne.mockResolvedValueOnce(null);
    
        const req = mockRequest({ params: { id: 1 } });
        const res = mockResponse();
    
        await updateProductbyId(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No product found with given id" });
    });
    
})


describe("delete product",()=>{
    it("should delete a product by ID", async () => {
        const mockProduct = {
            id: 1,
            title: "Product 1",
        };
    
        db.products.findOne.mockResolvedValueOnce(mockProduct);
        db.products.destroy.mockResolvedValueOnce(1); 
    
        const req = mockRequest({ params: { id: 1 } });
        const res = mockResponse();
    
        await deleteProductById(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Producted deleted", deleted: 1 });
    });
    
    it("should return 404 if no product found for deletion", async () => {
        db.products.findOne.mockResolvedValueOnce(null);
    
        const req = mockRequest({ params: { id: 1 } });
        const res = mockResponse();
    
        await deleteProductById(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "No product found with given id" });
    });
    
})