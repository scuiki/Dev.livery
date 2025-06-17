const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dev.livery API',
      version: '1.0.0',
      description: 'Documentação dos endpoints do app Dev.livery'
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/', require('./routes/users'));
app.use('/', require('./routes/products'));
app.use('/', require('./routes/orders'));
app.use('/cart', require('./routes/cart')); 

app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}/api-docs`);
});
