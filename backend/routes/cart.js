const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Adiciona item ao carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               quantidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item adicionado com sucesso
 */
router.post('/', cartController.addToCart);

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Buscar todos os itens do carrinho de um usuário
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de itens do carrinho
 */
router.get('/:userId', cartController.getCartByUser);

/**
 * @swagger
 * /cart:
 *   put:
 *     summary: Atualizar quantidade de um item do carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               quantidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantidade atualizada
 */
router.put('/', cartController.updateCartItem);

/**
 * @swagger
 * /cart/{userId}:
 *   delete:
 *     summary: Limpar carrinho de um usuário
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrinho limpo
 */
router.delete('/:userId', cartController.clearCart);

// Deletar item específico do carrinho
router.delete('/:userId/:productId', cartController.removeItemFromCart);

module.exports = router;
