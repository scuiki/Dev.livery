import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { getAllOrders, updateOrderStatus } from '../src/database/orderRepository';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const statusEtapas = ['Pedido', 'Em preparação', 'Pedido a caminho', 'Pedido Entregue'];

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);

  const carregarPedidos = async () => {
    const lista = await getAllOrders();
    setPedidos(lista);
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  const avancarStatus = async (pedido) => {
    const indexAtual = statusEtapas.indexOf(pedido.status);
    if (indexAtual < statusEtapas.length - 1) {
      const novoStatus = statusEtapas[indexAtual + 1];
      await updateOrderStatus(pedido.id, novoStatus);
      carregarPedidos(); // Atualiza a lista
    }
  };

  const pedidosEmAndamento = pedidos.filter(p => p.status !== 'Pedido Entregue');
  const pedidosEntregues = pedidos.filter(p => p.status === 'Pedido Entregue');

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
        <Ionicons name="chevron-back" size={24} color="#05C7F2" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Pedidos em Andamento</Text>
      {pedidosEmAndamento.map((pedido) => (
        <View key={pedido.id} style={styles.card}>
          <Text style={styles.info}><Text style={styles.label}>ID:</Text> {pedido.id}</Text>
          <Text style={styles.info}><Text style={styles.label}>Data:</Text> {new Date(pedido.data).toLocaleString()}</Text>
          <Text style={styles.info}><Text style={styles.label}>Endereço:</Text> {pedido.endereco}</Text>
          <Text style={styles.info}><Text style={styles.label}>Total:</Text> R$ {pedido.total.toFixed(2)}</Text>
          <Text style={styles.info}><Text style={styles.label}>Status:</Text> {pedido.status}</Text>
          <Text style={styles.label}>Itens:</Text>
          {pedido.itens.map((item, i) => (
            <Text key={i} style={styles.item}>- {item.quantidade}x {item.nome}</Text>
          ))}

          <TouchableOpacity
            onPress={() => avancarStatus(pedido)}
            style={styles.botao}
          >
            <Text style={styles.botaoTexto}>Avançar Status</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.titulo}>Pedidos Entregues</Text>
      {pedidosEntregues.map((pedido) => (
        <View key={pedido.id} style={styles.card}>
          <Text style={styles.info}><Text style={styles.label}>ID:</Text> {pedido.id}</Text>
          <Text style={styles.info}><Text style={styles.label}>Data:</Text> {new Date(pedido.data).toLocaleString()}</Text>
          <Text style={styles.info}><Text style={styles.label}>Endereço:</Text> {pedido.endereco}</Text>
          <Text style={styles.info}><Text style={styles.label}>Total:</Text> R$ {pedido.total.toFixed(2)}</Text>
          <Text style={styles.info}><Text style={styles.label}>Status:</Text> {pedido.status}</Text>
          <Text style={styles.label}>Itens:</Text>
          {pedido.itens.map((item, i) => (
            <Text key={i} style={styles.item}>- {item.quantidade}x {item.nome}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 16, textAlign: 'center', marginTop: 3 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  label: { fontWeight: 'bold', color: '#05C7F2' },
  info: { fontSize: 14, marginBottom: 4, color: '#333' },
  item: { fontSize: 13, marginLeft: 8, color: '#555' },
  botao: {
    marginTop: 10,
    backgroundColor: '#05C7F2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  botaoVoltar: {
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 1,
  },
});
