const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrdersByUser,
  updateOrderStatus,
  getDetailedOrdersByUser,
  getAllOrders
} = require('../controllers/orderController');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               status:
 *                 type: string
 *               endereco:
 *                 type: string
 *               total:
 *                 type: number
 *               data:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantidade:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
router.post('/orders', createOrder);

/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     summary: Lista todos os pedidos de um usuário
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário
 */
router.get('/orders/:userId', getOrdersByUser);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Atualiza o status de um pedido (admin)
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status atualizado
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/orders/:id/status', updateOrderStatus);

/**
 * @swagger
 * /orders/{userId}/detalhado:
 *   get:
 *     summary: Lista pedidos do usuário com seus itens
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista detalhada de pedidos com itens
 */
router.get('/orders/:userId/detalhado', getDetailedOrdersByUser);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos com itens e dados do usuário (admin)
 *     responses:
 *       200:
 *         description: Lista de todos os pedidos detalhados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   endereco:
 *                     type: string
 *                   total:
 *                     type: number
 *                   data:
 *                     type: string
 *                   email:
 *                     type: string
 *                   itens:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nome:
 *                           type: string
 *                         quantidade:
 *                           type: integer
 */
router.get('/orders', getAllOrders);

module.exports = router;
