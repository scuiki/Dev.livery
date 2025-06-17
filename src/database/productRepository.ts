import { Product } from '../types/Product';

const API_URL = 'http://192.168.2.129:3000';

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Erro ao buscar produtos.');
    return await response.json();
  } catch (error: any) {
    console.log('Erro ao buscar produtos:', error.message);
    return [];
  }
};

export const addProduct = async (
  nome: string,
  descricao: string,
  preco: number,
  imagemUri: string,
  categoria: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao, preco, imagemUri, categoria }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.log('Erro ao adicionar produto:', data.error || response.statusText);
      return false;
    }

    return true;
  } catch (error: any) {
    console.log('Erro ao adicionar produto:', error.message);
    return false;
  }
};

export const updateProductPrice = async (
  id: number,
  novoPreco: number
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preco: novoPreco }),
    });

    return response.ok;
  } catch (error: any) {
    console.log('Erro ao atualizar preço:', error.message);
    return false;
  }
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error: any) {
    console.log('Erro ao excluir produto:', error.message);
    return false;
  }
};
