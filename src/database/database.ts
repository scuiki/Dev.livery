import { openDatabaseSync } from 'expo-sqlite';

export const initDB = () => {
  const db = openDatabaseSync('devlivery.db');

  // Tabela de usuários
  const stmtUsers = db.prepareSync(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      celular TEXT,
      senha TEXT NOT NULL
    )`
  );
  stmtUsers.executeSync();
  stmtUsers.finalizeSync();

  // Tabela de carrinho
  const stmtCart = db.prepareSync(
    `CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      imagem TEXT,
      quantidade INTEGER DEFAULT 1
    )`
  );
  stmtCart.executeSync();
  stmtCart.finalizeSync();

  // Tabela de produtos (cardápio)
  const stmtProducts = db.prepareSync(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      imagem TEXT,
      categoria TEXT NOT NULL
    )`
  );
  stmtProducts.executeSync();
  stmtProducts.finalizeSync();

  // Tabela de pedidos
  const stmtPedidos = db.prepareSync(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itens TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Pedido',
      endereco TEXT NOT NULL,
      email TEXT NOT NULL,
      data TEXT
    );
  `);
  stmtPedidos.executeSync();
  stmtPedidos.finalizeSync();
};

