const db = require('../database');

// Criar produto
const createProduct = (req, res) => {
  const { nome, descricao, preco, imagemUri, categoria } = req.body;

  db.run(
    `INSERT INTO products (nome, descricao, preco, imagemUri, categoria)
     VALUES (?, ?, ?, ?, ?)`,
     [nome, descricao || '', preco, imagemUri || '', categoria || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ id: this.lastID });
    }
  );
};

// Listar todos os produtos
const getAllProducts = (req, res) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};

// Atualizar preço do produto
const updateProductPrice = (req, res) => {
  const { id } = req.params;
  const { preco } = req.body;

  db.run(
    `UPDATE products SET preco = ? WHERE id = ?`,
    [preco, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
      return res.json({ message: 'Preço atualizado' });
    }
  );
};

// Remover produto
const deleteProduct = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    return res.json({ message: 'Produto removido' });
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProductPrice,
  deleteProduct
};
