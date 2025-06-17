const db = require('../database');

// Adicionar item ao carrinho
exports.addToCart = (req, res) => {
  const { userId, productId, quantidade } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: 'userId e productId são obrigatórios.' });
  }

  const qtde = quantidade > 0 ? quantidade : 1;

  db.get(
    'SELECT * FROM carts WHERE userId = ? AND productId = ?',
    [userId, productId],
    (err, item) => {
      if (err) return res.status(500).json({ error: err.message });

      if (item) {
        // Item já existe no carrinho → atualiza a quantidade
        db.run(
          'UPDATE carts SET quantidade = quantidade + ? WHERE userId = ? AND productId = ?',
          [qtde, userId, productId],
          function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Item atualizado no carrinho.' });
          }
        );
      } else {
        // Item novo → insere
        db.run(
          'INSERT INTO carts (userId, productId, quantidade) VALUES (?, ?, ?)',
          [userId, productId, qtde],
          function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Item adicionado ao carrinho.' });
          }
        );
      }
    }
  );
};

// Obter itens do carrinho de um usuário
exports.getCartByUser = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId é obrigatório na URL.' });
  }

  db.all(
    `SELECT c.productId, c.quantidade, p.nome, p.preco, p.imagemUri
     FROM carts c
     JOIN products p ON c.productId = p.id
     WHERE c.userId = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Atualizar quantidade de um item
exports.updateCartItem = (req, res) => {
  const { userId, productId, quantidade } = req.body;

  if (!userId || !productId || quantidade === undefined) {
    return res.status(400).json({ error: 'userId, productId e quantidade são obrigatórios.' });
  }

  if (quantidade <= 0) {
    // Quantidade 0 → remover item
    db.run(
      'DELETE FROM carts WHERE userId = ? AND productId = ?',
      [userId, productId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item removido do carrinho.' });
      }
    );
  } else {
    // Atualizar quantidade
    db.run(
      'UPDATE carts SET quantidade = ? WHERE userId = ? AND productId = ?',
      [quantidade, userId, productId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Quantidade atualizada.' });
      }
    );
  }
};

// Limpar carrinho de um usuário
exports.clearCart = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'userId é obrigatório na URL.' });
  }

  db.run('DELETE FROM carts WHERE userId = ?', [userId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Carrinho esvaziado.' });
  });
};

exports.removeItemFromCart = (req, res) => {
    const { userId, productId } = req.params;
  
    db.run(
      `DELETE FROM carts WHERE userId = ? AND productId = ?`,
      [userId, productId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item removido do carrinho.' });
      }
    );
  };  