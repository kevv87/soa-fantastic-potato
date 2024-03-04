// index.js

require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API Documentation',
    },
  },
  apis: ['./routes/*.js'], // Point to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(express.json()); // Middleware to parse JSON requests

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sample route
app.use('/api', require('./src/routing'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
