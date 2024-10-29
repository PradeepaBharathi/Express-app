const userModal = (sequelize,DataTypes)=>{
const usersDetails = sequelize.define('user',{
    userName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    mobileNumber:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})
usersDetails.associate = (models) => {
    usersDetails.hasMany(models.carts, { 
        foreignKey: {
            name:"userId",
        onDelete: "CASCADE",}
    });
};
return usersDetails
}


export default userModal