import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.2.129:3000';

// Envia o pedido para o backend
export const fazerPedido = async (itens: any[], total: number, endereco: string): Promise<void> => {
  try {
    const email = await SecureStore.getItemAsync('userEmail');
    if (!email) throw new Error('Usuário não logado');

    // Buscar o userId com base no e-mail
    const userRes = await fetch(`${API_URL}/users/byEmail/${email}`);
    if (!userRes.ok) throw new Error('Usuário não encontrado');

    const user = await userRes.json();
    const userId = user.id;
    const data = new Date().toISOString();

    // Monta o corpo do pedido
    const corpoPedido = {
      userId,
      status: 'Pedido',
      endereco,
      total,
      data,
      items: itens.map((item) => ({
        productId: item.id,
        quantidade: item.quantidade,
      })),
    };

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpoPedido),
    });

    if (!response.ok) {
      const erro = await response.json();
      console.log('Erro ao fazer pedido:', erro.error);
    }
  } catch (error: any) {
    console.log('Erro ao fazer pedido:', error.message);
  }
};

// Busca todos os pedidos do usuário autenticado
export const getPedidos = async (): Promise<any[]> => {
  try {
    const email = await SecureStore.getItemAsync('userEmail');
    if (!email) return [];

    const userRes = await fetch(`${API_URL}/users/byEmail/${email}`);
    if (!userRes.ok) return [];

    const user = await userRes.json();
    const userId = user.id;

    const response = await fetch(`${API_URL}/orders/${userId}/detalhado`);
    if (!response.ok) return [];

    const pedidos = await response.json();

    // ✅ Normaliza os campos para o formato esperado no frontend
    return pedidos.map((p: any) => ({
      ...p,
      itens: p.items || [], // renomeia se necessário
    }));
  } catch (error: any) {
    console.log('Erro ao buscar pedidos:', error.message);
    return [];
  }
};

// Busca todos os pedidos (admin)
export const getAllOrders = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) return [];

    const pedidos = await response.json();

    // Normaliza os itens se necessário
    return pedidos.map((p: any) => ({
      ...p,
      itens: p.itens || [],
    }));
  } catch (error: any) {
    console.log('Erro ao buscar todos os pedidos:', error.message);
    return [];
  }
};

// Atualiza o status de um pedido (admin)
export const updateOrderStatus = async (id: number, novoStatus: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: novoStatus }),
    });

    if (!response.ok) {
      const erro = await response.json();
      console.log('Erro ao atualizar status:', erro.error || response.statusText);
      return false;
    }

    return true;
  } catch (error: any) {
    console.log('Erro ao atualizar status:', error.message);
    return false;
  }
};
