const productModal = (sequelize, DataTypes) => {
    const product = sequelize.define("product", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
                    
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

  
    product.associate = (models) => {
        product.hasMany(models.carts, {
            foreignKey:{
                name: "productId", 
            onDelete: "CASCADE"} 
        });
    };

    return product;
};

export default productModal;
