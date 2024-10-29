const cartModal = (sequelize, DataTypes) => {
    const cart = sequelize.define("cart", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement:true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        userId: { 
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
    });

   
    cart.associate = (models) => {
      
        cart.belongsTo(models.products, {
            foreignKey: {
                name: "productId", 
                onDelete: "CASCADE", 
            }
        });
       cart.belongsTo(models.usersDetails, { 
        foreignKey: {
            name: "userId",
            onDelete: "CASCADE",
        },
    });
    };

    return cart;
};

export default cartModal;
