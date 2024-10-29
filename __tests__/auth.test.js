import { verifyUser,renewToken } from '../authentication/auth.js';
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken');

describe("verifyUser middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: { authorization: "" },
            cookies: {}
        };

        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res),
            cookie: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return "Token not available" if no access token is present', async () => {
        req.headers.authorization = "";

        await verifyUser(req, res, next);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token not available' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return "mismatched token',async()=>{
        req.headers.authorization ="Bearer authorization"
        req.cookies.authorization ="different token"

        await verifyUser(req,res,next)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({ message:'mismatched token' })
        expect(next).not.toHaveBeenCalled();
    })

    it('should call renewToken if access token verification fails',async()=>{
        req.headers.authorization ='Bearer invalidToken'
        req.cookies.accessToken = 'invalidToken'

        jwt.verify.mockImplementationOnce((token,secret,callback)=>{
            callback(new Error('Token invalid',null))
        })

        await verifyUser(req,res,next)

        expect(jwt.verify).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    })
    

    it('should proceed with next middleware if access token is valid',async()=>{
        req.headers.authorization ='Bearer validToken'
        req.cookies.accessToken = 'validToken'

        jwt.verify.mockImplementationOnce((token,secret,callback)=>{
            callback(null,{userId:'123',email:"test@example.com"})
        })


        await verifyUser(req,res,next)

        expect(req.user).toEqual({id:'123',email:"test@example.com"});
        expect(next).toHaveBeenCalled()

    })
});
describe("renewToken middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            cookies: {}
        };

        res = {
            json: jest.fn(() => res),
            cookie: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return "Refresh Token Not Available" if no refresh token is present', async () => {
        req.cookies.refreshToken = ''; 

        await renewToken(req, res, next);

        expect(res.json).toHaveBeenCalledWith({ message: 'Refresh Token Not Available' });
        expect(next).not.toHaveBeenCalled();
    });
    it('should return "Invalid Refresh Token" if refresh token is invalid  ',async()=>{
       
        req.cookies.refreshToken = 'invalidToken'

        jwt.verify.mockImplementationOnce((token,secret,callback)=>{
            callback(new Error('Token invalid',null))
        })

        await renewToken(req,res,next)

        expect(res.json).toHaveBeenCalledWith({ message: "Invalid Refresh Token" });
        expect(next).not.toHaveBeenCalled();
    })

    it('should renew access token if refresh token is valid', async () => {
        req.cookies.refreshToken = 'validRefreshToken';

        jwt.verify.mockImplementationOnce((token, secret, callback) => {
            callback(null, { userId: '123', email: 'test@example.com' }); 
        });

        jwt.sign.mockReturnValue('newAccessToken'); 

        await renewToken(req, res, next);

        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: '123', email: 'test@example.com' },
            process.env.ACCESS_SECRET_KEY,
            { expiresIn: '30m' }
        );
        expect(res.cookie).toHaveBeenCalledWith('accessToken', 'newAccessToken', { maxAge: 30 * 60 * 1000 });
        expect(next).toHaveBeenCalled();
    });

    
});
