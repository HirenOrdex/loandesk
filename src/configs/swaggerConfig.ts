import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ALoanMatic API',
            version: '1.0.0',
            description: 'API documentation for ALoanMatic backend',
        },
        servers: [
            { url: "http://localhost:3000/", description: "Local" },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/*.ts', ], // Adjust this path based on where your routes are
};
