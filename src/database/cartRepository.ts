import { openDatabaseSync } from 'expo-sqlite';

export const addToCart = (
  nome: string,
  descricao: string,
  preco: number,
  imagem: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const db = openDatabaseSync('devlivery.db');

      const stmt = db.prepareSync(
        'INSERT INTO cart (nome, descricao, preco, imagem, quantidade) VALUES (?, ?, ?, ?, ?);'
      );
      stmt.executeSync([nome, descricao, preco, imagem, 1]);
      stmt.finalizeSync();
      resolve();
    } catch (error: any) {
      console.log('Erro ao adicionar ao carrinho:', error.message || error);
      reject(error);
    }
  });
};

export const getCartItems = (): Promise<any[]> => {
  return new Promise((resolve) => {
    try {
      const db = openDatabaseSync('devlivery.db');

      const stmt = db.prepareSync('SELECT * FROM cart;');
      const result = stmt.executeSync([]);
      const items = result.getAllSync();
      stmt.finalizeSync();
      resolve(items);
    } catch (error: any) {
      console.log('Erro ao buscar carrinho:', error.message || error);
      resolve([]);
    }
  });
};

export const updateCartItem = (
  id: number,
  quantidade: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const db = openDatabaseSync('devlivery.db');

      const stmt = db.prepareSync('UPDATE cart SET quantidade = ? WHERE id = ?;');
      stmt.executeSync([quantidade, id]);
      stmt.finalizeSync();
      resolve();
    } catch (error: any) {
      console.log('Erro ao atualizar item do carrinho:', error.message || error);
      reject(error);
    }
  });
};

export const clearCart = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const db = openDatabaseSync('devlivery.db');

      const stmt = db.prepareSync('DELETE FROM cart;');
      stmt.executeSync([]);
      stmt.finalizeSync();
      resolve();
    } catch (error: any) {
      console.log('Erro ao limpar carrinho:', error.message || error);
      reject(error);
    }
  });
};

export const removeCartItem = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const db = openDatabaseSync('devlivery.db');

      const stmt = db.prepareSync('DELETE FROM cart WHERE id = ?;');
      stmt.executeSync([id]);
      stmt.finalizeSync();
      resolve();
    } catch (error: any) {
      console.log('Erro ao remover item do carrinho:', error.message || error);
      reject(error);
    }
  });
};