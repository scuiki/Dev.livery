const db = require('../database');

// Criar novo pedido
const createOrder = (req, res) => {
  const { userId, status = 'Pedido', endereco, total, data, items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Itens do pedido são obrigatórios' });
  }

  db.run(
    `INSERT INTO orders (userId, status, endereco, total, data)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, status, endereco, total, data],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const orderId = this.lastID;

  // Inserir os itens do pedido com controle e fidelidade
  db.serialize(() => {
    const stmt = db.prepare(
      `INSERT INTO order_items (orderId, productId, quantidade) VALUES (?, ?, ?)`
    );

    for (const item of items) {
      if (item?.productId && item?.quantidade) {
        stmt.run(orderId, item.productId, item.quantidade);
      } else {
        console.warn('Item inválido:', item);
      }
    }

    stmt.finalize((err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Atualiza fidelidade
      db.get(`SELECT fidelidade FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });

        let fidelidadeAtual = user?.fidelidade || 0;
fidelidadeAtual++;

let fidelidadeParaSalvar = fidelidadeAtual;

// Quando o usuário atinge 6, ele já ganhou o desconto no 5º e agora resetamos
if (fidelidadeAtual > 5) {
  fidelidadeParaSalvar = 1; // inicia nova contagem
} 

// Atualiza fidelidade do usuário
db.run(`UPDATE users SET fidelidade = ? WHERE id = ?`, [fidelidadeParaSalvar, userId]);

// Marca o pedido como com brinde quando for o 5º
if (fidelidadeAtual === 5) {
  db.run(`UPDATE orders SET comBrinde = 1 WHERE id = ?`, [orderId]);
  console.log(`Usuário ${userId} ganhou um brinde no pedido ${orderId}!`);
}

return res.status(201).json({
  orderId,
  fidelidade: fidelidadeParaSalvar,
});

        return res.status(201).json({
          orderId,
          fidelidade: novaFidelidade >= 5 ? 0 : novaFidelidade,
        });
      });
    });
  });

    }
  );
};

// Listar pedidos por usuário
const getOrdersByUser = (req, res) => {
  const { userId } = req.params;

  db.all(`SELECT * FROM orders WHERE userId = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};

// Atualizar status do pedido (admin)
const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Pedido não encontrado' });
      return res.json({ message: 'Status atualizado' });
    }
  );
};

const getDetailedOrdersByUser = (req, res) => {
  const { userId } = req.params;

  db.all(`SELECT * FROM orders WHERE userId = ?`, [userId], (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    if (orders.length === 0) return res.json([]);

    // Mapeia todos os pedidos para Promises que resolvem os itens
    const promises = orders.map(order => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT oi.productId, oi.quantidade, p.nome
           FROM order_items oi
           JOIN products p ON oi.productId = p.id
           WHERE oi.orderId = ?`,
          [order.id],
          (err, items) => {
            if (err) return reject(err);

            resolve({
              ...order,
              items
            });
          }
        );
      });
    });

    Promise.all(promises)
      .then(pedidosDetalhados => res.json(pedidosDetalhados))
      .catch(error => res.status(500).json({ error: error.message }));
  });
};

  // Listar todos os pedidos com detalhes (admin)
const getAllOrders = (req, res) => {
    const sql = `
      SELECT o.*, u.email, p.nome AS produtoNome, oi.quantidade
      FROM orders o
      JOIN users u ON o.userId = u.id
      JOIN order_items oi ON oi.orderId = o.id
      JOIN products p ON p.id = oi.productId
      ORDER BY o.id DESC
    `;
  
    const db = require('../database');
    db.all(sql, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
  
      // Agrupar por pedido
      const pedidosMap = {};
      rows.forEach(row => {
        if (!pedidosMap[row.id]) {
          pedidosMap[row.id] = {
            id: row.id,
            userId: row.userId,
            status: row.status,
            endereco: row.endereco,
            total: row.total,
            data: row.data,
            email: row.email,
            itens: [],
          };
        }
        pedidosMap[row.id].itens.push({
          nome: row.produtoNome,
          quantidade: row.quantidade,
        });
      });
  
      const pedidos = Object.values(pedidosMap);
      res.json(pedidos);
    });
  };  

module.exports = {
  createOrder,
  getOrdersByUser,
  updateOrderStatus,
  getDetailedOrdersByUser,
  getAllOrders
};
