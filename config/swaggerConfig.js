import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'LEARNING SWAGGER API DOCUMENTATION',
            version: '1.0.0',
            description: 'This is a sample API documentation for a product management system.',
        },
        servers: [
            {
                url: 'http://localhost:9000/',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
