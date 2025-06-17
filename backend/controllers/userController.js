const db = require('../database');

const createUser = (req, res) => {
  const { nome, email, senha } = req.body;

  db.run(
    'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ id: this.lastID });
    }
  );
};

const loginUser = (req, res) => {
  const { email, senha } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ? AND senha = ?',
    [email, senha],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: 'Credenciais inválidas' });
      return res.json(row);
    }
  );
};

// Obter pontos de fidelidade do usuário
const getFidelidade = (req, res) => {
    const { id } = req.params;
  
    db.get(`SELECT fidelidade FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (!row) return res.status(404).json({ error: 'Usuário não encontrado' });
  
      return res.json({ fidelidade: row.fidelidade });
    });
  };

  // Obter dados do usuário pelo e-mail
const getUserByEmail = (req, res) => {
    const { email } = req.params;
  
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Usuário não encontrado' });
  
      return res.json(row);
    });
  };

module.exports = {
  createUser,
  loginUser,
  getFidelidade,
  getUserByEmail
};
