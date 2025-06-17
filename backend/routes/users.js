const express = require('express');
const router = express.Router();
const { createUser, loginUser, getFidelidade, getUserByEmail } = require('../controllers/userController');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cadastra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado
 */
router.post('/users', createUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Faz login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login efetuado
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /users/{id}/fidelidade:
 *   get:
 *     summary: Retorna os pontos de fidelidade do usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pontuação de fidelidade retornada com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/users/:id/fidelidade', getFidelidade);

/**
 * @swagger
 * /users/byEmail/{email}:
 *   get:
 *     summary: Retorna os dados do usuário pelo e-mail
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
router.get('/users/byEmail/:email', getUserByEmail);

module.exports = router;
