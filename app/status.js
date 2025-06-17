import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPedidos } from '../src/database/orderRepository';
import BottomTabs from '../components/bottomTabs';
import * as SecureStore from 'expo-secure-store';

export default function Status() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const statusEtapas = ['Pedido', 'Em preparação', 'Pedido a caminho', 'Pedido Entregue'];

  const buscarPedidosDoUsuario = async () => {
    setCarregando(true);
    const id = await SecureStore.getItemAsync('userId');
    if (!id) return setPedidos([]);
    
    try {
      const response = await fetch(`http://192.168.2.129:3000/orders/${id}/detalhado`);
      if (!response.ok) throw new Error('Erro ao buscar pedidos');
    
      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setPedidos([]);
    }
    setCarregando(false);
  };

  const renderEtapas = (statusAtual) =>
    statusEtapas.map((etapa, index) => {
      const etapaAtual = statusEtapas.indexOf(statusAtual);
      const concluida = index <= etapaAtual;
      return (
        <View key={etapa} style={styles.etapa}>
          <Ionicons
            name={concluida ? 'checkmark-circle' : 'ellipse-outline'}
            size={20}
            color={concluida ? '#05C7F2' : '#ccc'}
          />
          <Text style={[styles.etapaTexto, concluida && { color: '#05C7F2', fontWeight: 'bold' }]}>
            {etapa}
          </Text>
        </View>
      );
    });

  useEffect(() => {
    buscarPedidosDoUsuario();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Acompanhar Pedidos</Text>
        <TouchableOpacity onPress={buscarPedidosDoUsuario}>
          <Ionicons name="refresh" size={26} color="#05C7F2" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#05C7F2" />
        </View>
      ) : pedidos.length === 0 ? (
        <View style={styles.loader}>
          <Text style={styles.semPedido}>Nenhum pedido encontrado.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {pedidos.map((pedido, i) => (
            <View key={pedido.id} style={styles.card}>
              <Text style={styles.subtitulo}>Pedido #{pedido.id}</Text>
              <Text style={styles.info}><Text style={styles.label}>Data:</Text> {new Date(pedido.data).toLocaleString()}</Text>
              <Text style={styles.info}><Text style={styles.label}>Endereço:</Text> {pedido.endereco}</Text>
              <Text style={styles.info}><Text style={styles.label}>Total:</Text> R$ {pedido.total.toFixed(2)}</Text>

              <Text style={styles.label}>Status:</Text>
              {renderEtapas(pedido.status)}

              <Text style={styles.label}>Itens:</Text>
              {pedido.items.map((item, idx) => (
                <Text key={idx} style={styles.texto}>
                  {item.quantidade}x {item.nome}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 10,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#05C7F2',
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 2,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  etapa: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  etapaTexto: {
    marginLeft: 8,
    fontSize: 13,
    color: '#999',
  },
  label: {
    fontWeight: 'bold',
    color: '#05C7F2',
    marginTop: 8,
    marginBottom: 4,
  },
  semPedido: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
