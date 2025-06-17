const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./devlivery.db');

// Tabela de usuários
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
    )
  `);

// Coluna 'fidelidade'
db.all(`PRAGMA table_info(users)`, (err, columns) => {
    if (err) return console.error("Erro ao verificar colunas de 'users':", err.message);
  
    const temFidelidade = Array.isArray(columns) && columns.some(col => col.name === 'fidelidade');
    if (!temFidelidade) {
      db.run(`ALTER TABLE users ADD COLUMN fidelidade INTEGER DEFAULT 0`);
      console.log("Coluna 'fidelidade' adicionada à tabela 'users'.");
    }
  });
  

  // Tabela de produtos
db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      imagemUri TEXT
    )
  `);

// Coluna 'categoria' nos produtos
db.all(`PRAGMA table_info(products)`, (err, columns) => {
    if (err) return console.error("Erro ao verificar colunas de 'products':", err.message);
  
    const temCategoria = Array.isArray(columns) && columns.some(col => col.name === 'categoria');
    if (!temCategoria) {
      db.run(`ALTER TABLE products ADD COLUMN categoria TEXT DEFAULT 'geral'`);
      console.log("Coluna 'categoria' adicionada à tabela 'products'.");
    }
  });  

  // Tabela de pedidos
db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      status TEXT DEFAULT 'Pedido',
      endereco TEXT,
      total REAL,
      data TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Tabela de itens do pedido
db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER NOT NULL,
      productId INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `);

// Coluna 'comBrinde'
db.all(`PRAGMA table_info(orders)`, (err, columns) => {
    if (err) return console.error("Erro ao verificar colunas de 'orders':", err.message);
  
    const temBrinde = Array.isArray(columns) && columns.some(col => col.name === 'comBrinde');
    if (!temBrinde) {
      db.run(`ALTER TABLE orders ADD COLUMN comBrinde BOOLEAN DEFAULT 0`);
      console.log("Coluna 'comBrinde' adicionada à tabela 'orders'.");
    }
  });

  // Tabela de carrinho
db.run(`
  CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES products(id)
  )
`);
  
});

module.exports = db;
