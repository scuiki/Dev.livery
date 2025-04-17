import { openDatabaseSync } from 'expo-sqlite';

// Inicializa a tabela com a coluna de categoria
const db = openDatabaseSync('devlivery.db');
const createStmt = db.prepareSync(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL NOT NULL,
    imagem TEXT,
    categoria TEXT NOT NULL
  );
`);
createStmt.executeSync();
createStmt.finalizeSync();

// Listar todos os produtos
export const getAllProducts = (): any[] => {
  try {
    const db = openDatabaseSync('devlivery.db');
    const stmt = db.prepareSync('SELECT * FROM products');
    const result = stmt.executeSync([]);
    const items = result.getAllSync();
    stmt.finalizeSync();
    return items;
  } catch (error: any) {
    console.log('Erro ao buscar produtos:', error.message);
    return [];
  }
};

// Adicionar produto com categoria
export const addProduct = (
  nome: string,
  descricao: string,
  preco: number,
  imagem: string,
  categoria: string
): void => {
  try {
    const db = openDatabaseSync('devlivery.db');
    const stmt = db.prepareSync(
      'INSERT INTO products (nome, descricao, preco, imagem, categoria) VALUES (?, ?, ?, ?, ?);'
    );
    stmt.executeSync([nome, descricao, preco, imagem, categoria]);
    stmt.finalizeSync();
  } catch (error: any) {
    console.log('Erro ao adicionar produto:', error.message);
  }
};

// Atualizar apenas o preço
export const updateProductPrice = (id: number, novoPreco: number): void => {
  try {
    const db = openDatabaseSync('devlivery.db');
    const stmt = db.prepareSync('UPDATE products SET preco = ? WHERE id = ?;');
    stmt.executeSync([novoPreco, id]);
    stmt.finalizeSync();
  } catch (error: any) {
    console.log('Erro ao atualizar preço:', error.message);
  }
};

// Excluir produto
export const deleteProduct = (id: number): void => {
  try {
    const db = openDatabaseSync('devlivery.db');
    const stmt = db.prepareSync('DELETE FROM products WHERE id = ?;');
    stmt.executeSync([id]);
    stmt.finalizeSync();
  } catch (error: any) {
    console.log('Erro ao excluir produto:', error.message);
  }
};
