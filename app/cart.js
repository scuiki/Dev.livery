import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabs from '../components/bottomTabs';
import { getCartItems, updateCartItem, removeCartItem } from '../src/database/cartRepository';
import * as SecureStore from 'expo-secure-store';
import { fazerPedido } from '../src/database/orderRepository';
import { clearCart } from '../src/database/cartRepository';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Cart() {
  const [itens, setItens] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [endereco, setEndereco] = useState('Carregando endereço...');

  const taxaEntrega = 10;
  const desconto = 5;
  const total = subTotal + taxaEntrega - desconto;

  const carregarCarrinho = async () => {
    const itensDB = await getCartItems();
    setItens(itensDB);
    calcularSubtotal(itensDB);
  };

  const carregarEndereco = async () => {
    const salvo = await SecureStore.getItemAsync('userEndereco');
    if (salvo) setEndereco(salvo);
    else setEndereco('Endereço não cadastrado');
  };
  
  carregarEndereco();  

  const calcularSubtotal = (lista) => {
    const total = lista.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    setSubTotal(total);
  };

  const alterarQuantidade = async (id, novaQtd) => {
    if (novaQtd < 1) {
      await removeCartItem(id);
    } else {
      await updateCartItem(id, novaQtd);
    }
    carregarCarrinho();
  };

  const realizarPedido = async () => {
    if (itens.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }
  
    try {
      await fazerPedido(itens, total, endereco);
      await clearCart();
      alert('Pedido realizado com sucesso!');
      router.replace('/status'); // você criará essa tela depois
    } catch (err) {
      alert('Erro ao fazer o pedido.');
      console.error(err);
    }
  };

  useEffect(() => {
    carregarCarrinho();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 90 }}>

        <Text style={styles.titulo}>Detalhes do pedido</Text>

        {/* Lista de itens */}
        {itens.map(item => (
          <View key={item.id} style={styles.cardItem}>
            <Image source={{ uri: item.imagem }} style={styles.imagemItem} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nomeItem}>{item.nome}</Text>
              <Text style={styles.descItem}>{item.descricao}</Text>
              <Text style={styles.precoItem}>R${item.preco.toFixed(2)}</Text>
            </View>
            <View style={styles.contador}>
              <TouchableOpacity onPress={() => alterarQuantidade(item.id, item.quantidade - 1)} style={styles.botaoContador}>
                <Text style={styles.contadorTexto}>-</Text>
              </TouchableOpacity>
              <Text style={styles.contadorValor}>{item.quantidade}</Text>
              <TouchableOpacity onPress={() => alterarQuantidade(item.id, item.quantidade + 1)} style={styles.botaoContador}>
                <Text style={styles.contadorTexto}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Endereço */}
        <Text style={styles.titulo}>Endereço de entrega</Text>
        <View style={styles.cardEndereco}>
          <Ionicons name="location-sharp" size={18} color="#05C7F2" />
          <Text style={styles.textoEndereco}>{endereco}</Text>
        </View>

        {/* Pagamento */}
        <Text style={styles.titulo}>Método de pagamento</Text>
        <View style={styles.cardEndereco}>
          <Ionicons name="card" size={18} color="#05C7F2" />
          <Text style={styles.textoEndereco}>Na entrega</Text>
        </View>

        {/* Resumo */}
        <View style={styles.resumoPedido}>
          <View style={styles.linhaResumo}>
            <Text style={styles.resumoTexto}>Sub-Total</Text>
            <Text style={styles.resumoTexto}>R$ {subTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.linhaResumo}>
            <Text style={styles.resumoTexto}>Taxa de entrega</Text>
            <Text style={styles.resumoTexto}>R$ {taxaEntrega.toFixed(2)}</Text>
          </View>
          <View style={styles.linhaResumo}>
            <Text style={styles.resumoTexto}>Desconto</Text>
            <Text style={styles.resumoTexto}>R$ {desconto.toFixed(2)}</Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.linhaResumo}>
            <Text style={styles.resumoTotal}>Total</Text>
            <Text style={styles.resumoTotal}>R$ {total.toFixed(2)}</Text>
          </View>

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
});
