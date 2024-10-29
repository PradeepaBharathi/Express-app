import { loginUser, registerUser, validateLoginUser, validateRegisterUser } from "../controller/userController";
import { db } from "../dbConnection";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
console.log(db)

jest.mock('jsonwebtoken');

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));


jest.mock("../dbConnection",()=>({
    db: {
      
        usersDetails: {
            findOne: jest.fn(),
            create:jest.fn()
        },
    },
}))

let mockRequest = (body={})=>({
    body   
})

let mockResponse = ()=>{
    const res ={}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    res.cookie = jest.fn();
    return res
}


describe("register", () => {
    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    it("should return 400 if validation fails", async () => {
        const req = mockRequest({});
        const res = mockResponse();

        
        await validateRegisterUser[0].run(req); 
        await validateRegisterUser[1].run(req); 
        await validateRegisterUser[2].run(req); 
        await validateRegisterUser[3].run(req); 

        await registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400); 
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Array) }));
    });

    it("should return 409 if email already exists",async()=>{
       db.usersDetails.findOne.mockResolvedValueOnce({id:1,email:"test@example.com"})


        const req = mockRequest({
             userName: "Test User",
             email: "test@example.com",
             password: "password123",
             mobileNumber: "1234567890" 
            })
        const res = mockResponse()
            
            await registerUser(req,res)
        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({message:"Email already exists"})
    })


    it('should register a new user and return 200', async () => {
        const hashedPassword = 'hashedPassword'; 
    
        bcrypt.hash.mockResolvedValue(hashedPassword);
    
        db.usersDetails.findOne.mockResolvedValueOnce(null); 
        db.usersDetails.create.mockResolvedValueOnce({ id: 1, email: 'test@example.com' }); 
    
        const req = mockRequest({
            userName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            mobileNumber: '1234567890',
        });
        const res = mockResponse();
    
        await registerUser(req, res);
    
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10); 
        expect(db.usersDetails.create).toHaveBeenCalledWith(expect.objectContaining({
            userName: 'Test User',
            email: 'test@example.com',
            password: hashedPassword, 
            mobileNumber: '1234567890',
        }));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User registered", users: { id: 1, email: 'test@example.com' } });
    });
    
    it('should return 500 if there is a server error', async () => {
        db.usersDetails.findOne.mockResolvedValueOnce(null);
        
        db.usersDetails.create.mockRejectedValueOnce(new Error('Database error'));
    
        const req = mockRequest({
            userName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            mobileNumber: '1234567890',
        });
        const res = mockResponse();
    
        await registerUser(req, res);
    
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error", error: 'Database error' });
    });
    
});


describe("login",()=>{
    it("should return 400 if validation fails", async () => {
        const req = mockRequest({});
        const res = mockResponse();

        
        await validateLoginUser[0].run(req); 
        await validateLoginUser[1].run(req); 
     

        await loginUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400); 
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Array) }));
    });
    it("should return 404 if email doesn't exists",async()=>{
        db.usersDetails.findOne.mockResolvedValueOnce(null)
 
 
         const req = mockRequest({
             
              email: "test@example.com",
              password: "password123",
            
             })
         const res = mockResponse()
             
             await loginUser(req,res)
         expect(res.status).toHaveBeenCalledWith(404)
         expect(res.json).toHaveBeenCalledWith({message:"User not found"})
     })


     it('should return 401 when Credentials doesnt match',async()=>{
        db.usersDetails.findOne.mockResolvedValueOnce({id:1,email:"test@example.com",password:"testpassword"})

        bcrypt.compare.mockResolvedValueOnce(false)


        const req =mockRequest({email:"test@example.com",password:"wrongpassword"})

        const res = mockResponse()

        await loginUser(req,res)
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid Credentials" });
     })

    it("should login and store the tokens",async()=>{
        const user = {id:1,email:"test@example.com",password:"hashedPassword"}

        db.usersDetails.findOne.mockResolvedValueOnce(user)
        bcrypt.compare.mockResolvedValueOnce(true)
        

        const accessToken ='accessToken'
        const refreshToken = 'refreshToken'
    
        jwt.sign.mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken);

        const req = mockRequest({ email: "test@example.com", password: "password123" });
        const res = mockResponse();

        await loginUser(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith("password123", user.password); 
        expect(jwt.sign).toHaveBeenCalledTimes(2); 
        expect(res.cookie).toHaveBeenCalledWith("accessToken", accessToken, { maxAge: 30 * 60 * 1000, httpOnly: true });
        expect(res.cookie).toHaveBeenCalledWith("refreshToken", refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "User logged in",
            users: user,
            accessToken,
            refreshToken,
        });


    }) 

   
    it('should return 500 if there is a server error', async () => {
      
        db.usersDetails.findOne.mockRejectedValueOnce(new Error('Database error'));

        const req = mockRequest({
            email: 'test@example.com',
            password: 'password123',
        });
        const res = mockResponse();

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error", error: 'Database error' });
    });

   
    
})