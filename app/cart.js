import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabs from '../components/bottomTabs';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.2.129:3000';
const { width } = Dimensions.get('window');

export default function Cart() {
  const [itens, setItens] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [endereco, setEndereco] = useState('Carregando endereço...');
  const [userId, setUserId] = useState(null);
  const [fidelidade, setFidelidade] = useState(0);
  const [descontoGanho, setDescontoGanho] = useState(false);

  const taxaEntrega = 10;
  const [descontoFidelidade, setDescontoFidelidade] = useState(0);
  const fidelidadeVisual = fidelidade === 0 && descontoFidelidade > 0 ? 5 : fidelidade;
  const total = Number(subTotal) + Number(taxaEntrega) - Number(descontoFidelidade);

  const carregarCarrinho = async (id, descontoAtivo) => {
    try {
      const response = await fetch(`${API_URL}/cart/${id}`);
      const data = await response.json();
      setItens(data);
      await calcularSubtotal(data, descontoAtivo);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  };

  const carregarEndereco = async () => {
    const salvo = await SecureStore.getItemAsync('userEndereco');
    if (salvo) setEndereco(salvo);
    else setEndereco('Endereço não cadastrado');
  };

  const calcularSubtotal = (lista, pontosFidelidade) => {
    const total = lista.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    setSubTotal(total);
  
    if (pontosFidelidade === 5) {
      const desconto = total * 0.2;
      setDescontoFidelidade(desconto);
    } else {
      setDescontoFidelidade(0);
    }
  };
  

  const carregarFidelidade = async (id, descontoAtivo) => {
    try {
      const res = await fetch(`${API_URL}/users/${id}/fidelidade`);
      const json = await res.json();
      const pontos = json.fidelidade || 0;
  
      if (pontos === 0 && descontoAtivo) {
        setFidelidade(5);
      } else {
        setFidelidade(pontos);
      }
    } catch (error) {
      console.log('Erro ao carregar fidelidade:', error.message);
    }
  };

  const alterarQuantidade = async (productId, novaQtd) => {
    try {
      if (novaQtd <= 0) {
        await fetch(`${API_URL}/cart/${userId}/${productId}`, { method: 'DELETE' });
      } else {
        await fetch(`${API_URL}/cart`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, productId, quantidade: novaQtd }),
        });
      }
      carregarCarrinho(userId);
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  const realizarPedido = async () => {
    if (itens.length === 0) return Alert.alert('Carrinho vazio');
    if (!endereco || endereco === 'Endereço não cadastrado')
      return Alert.alert('Cadastre um endereço antes');
  
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          endereco,
          total,
          data: new Date().toISOString(), // envia a data corretamente
          items: itens.map(item => ({
            productId: item.productId,
            quantidade: item.quantidade
          })),
        }),
      });
  
      if (!response.ok) throw new Error('Erro ao fazer pedido');
  
      const { orderId, fidelidade: novaFidelidade } = await response.json();
      setFidelidade(novaFidelidade);
  
      if (novaFidelidade === 0) {
        // Se resetou, é porque o usuário acabou de ganhar o brinde no pedido 5
        setDescontoGanho(true);
        await SecureStore.setItemAsync('descontoGanho', 'true');
      } else {
        setDescontoGanho(false);
        await SecureStore.deleteItemAsync('descontoGanho');
      }
  
      await fetch(`${API_URL}/cart/${userId}`, { method: 'DELETE' });
  
      Alert.alert('Sucesso', 'Pedido realizado com sucesso!');
      router.replace('/status');
    } catch (error) {
      console.error('Erro no pedido:', error);
      Alert.alert('Erro', 'Não foi possível realizar o pedido');
    }
  };  

  useEffect(() => {
    const init = async () => {
      const id = await SecureStore.getItemAsync('userId');
      if (!id) return;
    
      const userIdNumber = Number(id);
      setUserId(userIdNumber);
    
      await carregarEndereco();
    
      try {
        const res = await fetch(`${API_URL}/users/${userIdNumber}/fidelidade`);
        const json = await res.json();
        const pontos = json.fidelidade || 0;
        setFidelidade(pontos);
    
        const carrinhoRes = await fetch(`${API_URL}/cart/${userIdNumber}`);
        const carrinho = await carrinhoRes.json();
        setItens(carrinho);
    
        calcularSubtotal(carrinho, pontos);
      } catch (error) {
        console.log('Erro ao inicializar dados:', error);
      }
    };    
    init();
  }, []);
  
  useEffect(() => {
    if (userId) {
      carregarCarrinho(userId, descontoGanho);
    }
  }, [descontoGanho]);  

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 90 }}>
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.titulo}>Fidelidade</Text>
        <View style={styles.barraContainer}>
          <View style={[styles.barraPreenchida, { width: `${(fidelidadeVisual / 5) * 100}%` }]} />
        </View>
        <Text style={styles.textoFidelidade}>
          {fidelidadeVisual < 5
            ? `${fidelidadeVisual}/5 pedidos para ganhar 20% de desconto`
            : 'Parabéns! Você ganhou 20% de desconto neste pedido'}
        </Text>
      </View>

        <Text style={styles.titulo}>Detalhes do pedido</Text>

        {itens.map(item => (
          <View key={item.productId} style={styles.cardItem}>
            <Image source={{ uri: item.imagemUri }} style={styles.imagemItem} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nomeItem}>{item.nome}</Text>
              <Text style={styles.descItem}>{item.descricao}</Text>
              <Text style={styles.precoItem}>R${item.preco.toFixed(2)}</Text>
            </View>
            <View style={styles.contador}>
              <TouchableOpacity onPress={() => alterarQuantidade(item.productId, item.quantidade - 1)} style={styles.botaoContador}>
                <Text style={styles.contadorTexto}>-</Text>
              </TouchableOpacity>
              <Text style={styles.contadorValor}>{item.quantidade}</Text>
              <TouchableOpacity onPress={() => alterarQuantidade(item.productId, item.quantidade + 1)} style={styles.botaoContador}>
                <Text style={styles.contadorTexto}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Endereço e resumo */} 
        <Text style={styles.titulo}>Endereço de entrega</Text>
        <View style={styles.cardEndereco}>
          <Ionicons name="location-sharp" size={18} color="#05C7F2" />
          <Text style={styles.textoEndereco}>{endereco}</Text>
        </View>

        <Text style={styles.titulo}>Método de pagamento</Text>
        <View style={styles.cardEndereco}>
          <Ionicons name="card" size={18} color="#05C7F2" />
          <Text style={styles.textoEndereco}>Na entrega</Text>
        </View>

        <View style={styles.resumoPedido}>
          <View style={styles.linhaResumo}><Text style={styles.resumoTexto}>Sub-Total</Text><Text style={styles.resumoTexto}>R$ {subTotal.toFixed(2)}</Text></View>
          <View style={styles.linhaResumo}><Text style={styles.resumoTexto}>Taxa de entrega</Text><Text style={styles.resumoTexto}>R$ {taxaEntrega.toFixed(2)}</Text></View>
          <View style={styles.linhaResumo}>
            <Text style={styles.resumoTexto}>Desconto</Text>
            <Text style={styles.resumoTexto}>R$ {descontoFidelidade.toFixed(2)}</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.linhaResumo}><Text style={styles.resumoTotal}>Total</Text><Text style={styles.resumoTotal}>R$ {total.toFixed(2)}</Text></View>

          <TouchableOpacity style={styles.botaoPedido} onPress={realizarPedido}>
            <Text style={styles.botaoTexto}>Fazer pedido</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 10 },
  botaoVoltar: { marginBottom: 10 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  cardItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 3,
    alignItems: 'center',
  },
  imagemItem: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  nomeItem: { fontWeight: 'bold', fontSize: 14 },
  descItem: { fontSize: 12, color: '#777' },
  precoItem: { color: '#05C7F2', fontWeight: '600', marginTop: 4 },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef6fb',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  botaoContador: {
    padding: 6,
  },
  contadorTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#05C7F2',
  },
  contadorValor: {
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  cardEndereco: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    marginBottom: 20,
  },
  textoEndereco: { marginLeft: 8, fontWeight: '500', color: '#555' },
  resumoPedido: {
    backgroundColor: '#05C7F2',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    marginBottom: 60,
  },
  resumoTexto: { color: '#fff', fontSize: 14, marginVertical: 2 },
  resumoTotal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
  },
  linhaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  divisor: {
    height: 1,
    backgroundColor: '#ffffff44',
    marginVertical: 8,
  },
  botaoPedido: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    elevation: 3,
  },
  botaoTexto: {
    color: '#05C7F2',
    fontWeight: 'bold',
    fontSize: 18,
  },
  barraContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 4,
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: '#05C7F2',
  },
  textoFidelidade: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
  },
  
});
