import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.2.129:3000';

export const getCartItems = async (): Promise<any[]> => {
  try {
    const userId = await SecureStore.getItemAsync('userId');
    if (!userId) throw new Error('Usuário não autenticado');

    const response = await fetch(`${API_URL}/cart/${userId}`);
    if (!response.ok) throw new Error('Erro ao buscar carrinho');
    
    return await response.json();
  } catch (err) {
    console.error('Erro ao buscar carrinho:', err);
    return [];
  }
};

export const addToCart = async (productId: number): Promise<void> => {
  try {
    const userId = await SecureStore.getItemAsync('userId');
    if (!userId) throw new Error('Usuário não autenticado');

    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: Number(userId), productId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'Erro ao adicionar item');
    }
  } catch (err) {
    console.error('Erro ao adicionar ao carrinho:', err);
    throw err;
  }
};

export const updateCartItem = async (
  productId: number,
  quantidade: number
): Promise<void> => {
  try {
    const userId = await SecureStore.getItemAsync('userId');
    if (!userId) throw new Error('Usuário não autenticado');

    const response = await fetch(`${API_URL}/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: Number(userId), productId, quantidade }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'Erro ao atualizar item');
    }
  } catch (err) {
    console.error('Erro ao atualizar item:', err);
    throw err;
  }
};

export const removeCartItem = async (productId: number): Promise<void> => {
  await updateCartItem(productId, 0); // zera quantidade no backend, removendo o item
};

export const clearCart = async (): Promise<void> => {
  try {
    const userId = await SecureStore.getItemAsync('userId');
    if (!userId) throw new Error('Usuário não autenticado');

    const response = await fetch(`${API_URL}/cart/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'Erro ao limpar carrinho');
    }
  } catch (err) {
    console.error('Erro ao limpar carrinho:', err);
    throw err;
  }
};
