import { DataTypes, Sequelize } from "@sequelize/core";
import { MySqlDialect } from '@sequelize/mysql';
import dbconfig from "./config/dbConfig.js";
import userModal from "./modals/userModal.js";
import ProductModal from "./modals/productModal.js";
import cartModal from "./modals/cartModal.js";

const sequelize = new Sequelize({
    dialect:MySqlDialect,
    database:dbconfig.DATABASE,
    user:dbconfig.USER,
    password:dbconfig.PASSWORD,
    host:dbconfig.HOST,
    port:dbconfig.PORT,
    
})


const connectDB = async()=>{
    try {
        await sequelize.authenticate()
        console.log("DB CONNECTED SUCCESSFULLY")
    } catch (error) {
        console.log(" UNABLE TO CONNECT TO DATABASE")
    }
}

const db ={
    Sequelize,
    sequelize,
    usersDetails : userModal(sequelize,DataTypes),
    products: ProductModal(sequelize, DataTypes),
    carts:cartModal(sequelize,DataTypes)
}

db.carts.associate(db); 
db.products.associate(db);
db.usersDetails.associate(db);



db.sequelize.sync({alter:true})
.then(()=>{
    console.log("Sync done")
})
export{sequelize,connectDB,db}