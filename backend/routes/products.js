const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProductPrice,
  deleteProduct
} = require('../controllers/productController');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/products', getAllProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cadastra um novo produto (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               imagemUri:
 *                 type: string
 *               categoria:
 *               type: string
 *     responses:
 *       201:
 *         description: Produto criado
 */
router.post('/products', createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza o preço de um produto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preco:
 *                 type: number
 *     responses:
 *       200:
 *         description: Preço atualizado
 *       404:
 *         description: Produto não encontrado
 */
router.put('/products/:id', updateProductPrice);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/products/:id', deleteProduct);

module.exports = router;
