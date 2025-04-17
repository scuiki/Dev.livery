import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import {
  getAllProducts, addProduct, updateProductPrice, deleteProduct
} from '../src/database/productRepository';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Admin() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [categoria, setCategoria] = useState('Entradas');
  const [precosEditados, setPrecosEditados] = useState({});

  const categorias = ['Entradas', 'Pizzas', 'Burgers'];

  const carregarProdutos = () => {
    const todos = getAllProducts();
    setProdutos(todos);
  };

  const handleAdd = () => {
    if (!nome || !descricao || !preco || !imagem || !categoria) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    addProduct(nome, descricao, parseFloat(preco), imagem, categoria);
    setNome('');
    setDescricao('');
    setPreco('');
    setImagem('');
    setCategoria('Entradas');
    carregarProdutos();
  };

  const handleEditarPreco = (id) => {
    const novo = parseFloat(precosEditados[id]);
    if (isNaN(novo)) return;
    updateProductPrice(id, novo);
    carregarProdutos();
  };

  const handleRemover = (id) => {
    Alert.alert('Confirmar', 'Deseja remover este item?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: () => {
          deleteProduct(id);
          carregarProdutos();
        }
      }
    ]);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userEmail');
    Alert.alert('Logout realizado', 'Você foi desconectado com sucesso.');
    router.replace('/');
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.titulo}>Gerenciar Pedidos</Text>
      <TouchableOpacity onPress={() => router.push('/adminPedidos')} style={styles.botaoAdd}>
        <Text style={styles.textoAdd}>Ver Pedidos Recebidos</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Cadastrar novo item</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
      />
      <TextInput
        style={styles.input}
        placeholder="Imagem URI (local ou url)"
        value={imagem}
        onChangeText={setImagem}
      />

      <View style={styles.categorias}>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategoria(cat)}
            style={[
              styles.botaoCategoria,
              categoria === cat && styles.categoriaSelecionada
            ]}
          >
            <Text style={categoria === cat ? styles.textoSelecionado : styles.textoCategoria}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.botaoAdd} onPress={handleAdd}>
        <Text style={styles.textoAdd}>Adicionar produto</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Produtos cadastrados</Text>

      {produtos.map((p) => (
        <View key={p.id} style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>{p.nome} ({p.categoria})</Text>
            <Text style={styles.desc}>{p.descricao}</Text>
            <Text style={styles.label}>Preço atual: R$ {p.preco.toFixed(2)}</Text>
            <TextInput
              style={styles.inputMenor}
              placeholder="Novo preço"
              keyboardType="numeric"
              value={precosEditados[p.id] || ''}
              onChangeText={(v) => setPrecosEditados({ ...precosEditados, [p.id]: v })}
            />
            <TouchableOpacity
              onPress={() => handleEditarPreco(p.id)}
              style={styles.botaoMenor}
            >
              <Text style={styles.textoAdd}>Salvar preço</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => handleRemover(p.id)} style={styles.remover}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>Excluir</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={handleLogout} style={styles.botaoLogout}>
        <Text style={styles.textoLogout}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 10,
  },
  inputMenor: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 8, marginVertical: 6, width: 120,
  },
  categorias: { flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap' },
  botaoCategoria: {
    borderWidth: 1, borderColor: '#05C7F2',
    padding: 8, borderRadius: 20, marginRight: 10, marginBottom: 6,
  },
  categoriaSelecionada: {
    backgroundColor: '#05C7F2',
  },
  textoCategoria: { color: '#05C7F2' },
  textoSelecionado: { color: '#fff' },
  botaoAdd: {
    backgroundColor: '#05C7F2', padding: 12, borderRadius: 8,
    alignItems: 'center', marginBottom: 20,
  },
  textoAdd: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nome: { fontWeight: 'bold', fontSize: 16 },
  desc: { color: '#555' },
  label: { marginTop: 6, fontSize: 13 },
  botaoMenor: {
    backgroundColor: '#05C7F2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start'
  },
  remover: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  botaoLogout: {
    marginTop: 30,
    backgroundColor: '#05C7F2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  textoLogout: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
