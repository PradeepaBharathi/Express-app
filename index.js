import express from  'express'
import dotenv from 'dotenv'
import { connectDB } from './dbConnection.js'
import userRoute from './routes/userRouter.js'
import { verifyUser } from './authentication/auth.js'
import cookieParser from 'cookie-parser'
import productRoute from './routes/productRoutes.js'
import cartRoute from './routes/cartRoutes.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swaggerConfig.js'
const app = express()
dotenv.config()

app.use(cookieParser());
app.use(express.json())
connectDB()

const PORT  = process.env.PORT

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use("/user",userRoute)

app.use('/uploads', express.static('uploads'));
app.use("/product",verifyUser,productRoute)
app.use("/cart",verifyUser,cartRoute) 

app.get("/",verifyUser,(req,res)=>{
     res.status(200).json({message:"API WORKING"})
})


app.listen (PORT,()=>{
    console.log(`App is listening to port ${PORT}`)
})