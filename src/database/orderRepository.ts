import { openDatabaseSync } from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

export const fazerPedido = async (itens: any[], total: number, endereco: string): Promise<void> => {
  try {
    const db = openDatabaseSync('devlivery.db');
    const email = await SecureStore.getItemAsync('userEmail');
    const stmt = db.prepareSync(
      'INSERT INTO pedidos (itens, total, endereco, email, data) VALUES (?, ?, ?, ?, ?);'
    );
    const data = new Date().toISOString();
    stmt.executeSync([JSON.stringify(itens), total, endereco, email ?? 'desconhecido', data]);
    stmt.finalizeSync();
  } catch (error: any) {
    console.log('Erro ao fazer pedido:', error.message);
  }
};

export const getPedidos = (): any[] => {
  try {
    const db = openDatabaseSync('devlivery.db');
    const stmt = db.prepareSync('SELECT * FROM pedidos ORDER BY id DESC;');
    const result = stmt.executeSync([]);
    const pedidos = result.getAllSync();
    stmt.finalizeSync();
    return pedidos.map((p: any) => ({ ...p, itens: JSON.parse(p.itens) }));
  } catch (error: any) {
    console.log('Erro ao buscar pedidos:', error.message);
    return [];
  }
};

export const atualizarStatusPedido = (id: number, novoStatus: string): void => {
  try {
    const db = openDatabaseSync('devlivery.db');
    const stmt = db.prepareSync('UPDATE pedidos SET status = ? WHERE id = ?;');
    stmt.executeSync([novoStatus, id]);
    stmt.finalizeSync();
  } catch (error: any) {
    console.log('Erro ao atualizar status:', error.message);
  }
};
