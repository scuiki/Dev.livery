import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabs from '../components/bottomTabs';
import { useRouter } from 'expo-router';
import { getAllProducts } from '../src/database/productRepository';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [busca, setBusca] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [endereco, setEndereco] = useState('Carregando endereço...');
  const router = useRouter();

  useEffect(() => {
    const carregarProdutos = async () => {
      const todos = await getAllProducts();
      setProdutos(todos);

      const categoriasUnicas = [...new Set(todos.map((p) => p.categoria))];
      setCategorias(categoriasUnicas);
      if (categoriasUnicas.length > 0) setCategoriaAtiva(categoriasUnicas[0]);
    };

    carregarProdutos();
  }, []);

  useEffect(() => {
    const carregarEndereco = async () => {
      const salvo = await SecureStore.getItemAsync('userEndereco');
      if (salvo) setEndereco(salvo);
      else setEndereco('Endereço não cadastrado');
    };
    carregarEndereco();
  }, []);

  const destaques = produtos.filter((p) => p.id === 8 || p.id === 10);

  const itensFiltrados = produtos.filter(
    (p) =>
      p.categoria === categoriaAtiva &&
      p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Endereço */}
        <TouchableOpacity style={styles.enderecoContainer} onPress={() => router.push('/modal/endereco')}>
          <Ionicons name="location-sharp" size={20} color="#05C7F2" />
          <Text style={styles.endereco}>{endereco}</Text>
        </TouchableOpacity>

        {/* Barra de busca */}
        <TextInput
          placeholder="Pesquisar..."
          style={styles.busca}
          value={busca}
          onChangeText={setBusca}
        />

        {/* Carrossel */}
        <Text style={styles.tituloSessao}>Populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carrossel}>
          {destaques.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.cardDestaque}
              onPress={() =>
                router.push({
                  pathname: '/details',
                  params: {
                    id: item.id,
                    nome: item.nome,
                    descricao: item.descricao,
                    preco: item.preco,
                    imagemUri: item.imagemUri,
                  },
                })
              }
            >
              <Image source={{ uri: item.imagemUri }} style={styles.imagemDestaque} />
              <Text style={styles.nomeItem}>{item.nome}</Text>
              <Text style={styles.precoItem}>R${item.preco.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cardápio */}
        <Text style={styles.tituloSessao}>Cardápio</Text>

        <View style={styles.tabs}>
          {categorias.map((cat) => (
            <TouchableOpacity key={cat} onPress={() => setCategoriaAtiva(cat)}>
              <Text style={[styles.tab, categoriaAtiva === cat && styles.tabAtivo]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {itensFiltrados.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              router.push({
                pathname: '/details',
                params: {
                  id: item.id,
                  nome: item.nome,
                  descricao: item.descricao,
                  preco: item.preco,
                  imagemUri: item.imagemUri,
                },
              })
            }
            style={styles.itemCard}
          >
            <View>
              <Text style={styles.nomeItem}>{item.nome}</Text>
              <Text style={styles.descItem}>{item.descricao}</Text>
              <Text style={styles.precoItem}>R${item.preco.toFixed(2)}</Text>
            </View>
            <Image source={{ uri: item.imagemUri }} style={styles.imagemItem} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 20, backgroundColor: '#fff' },
  enderecoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  endereco: { marginLeft: 6, fontSize: 16, fontWeight: '600', color: '#555' },
  busca: {
    backgroundColor: '#eef6fb',
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tituloSessao: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  carrossel: { flexDirection: 'row' },
  cardDestaque: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginTop: 2,
    marginRight: 10,
    marginLeft: 4,
    marginBottom: 14,
    width: 150,
    elevation: 3,
    alignItems: 'center',
  },
  imagemDestaque: { width: 100, height: 100, resizeMode: 'contain', borderRadius: 8 },
  nomeItem: { fontWeight: 'bold', fontSize: 14, marginTop: 6 },
  precoItem: { color: '#05C7F2', fontWeight: '600', marginTop: 4 },
  tabs: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  tab: { marginHorizontal: 10, fontSize: 14, color: '#666' },
  tabAtivo: {
    backgroundColor: '#05C7F2',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
    borderTopWidth: 0.5,
    borderColor: '#eee',
  },
  descItem: { fontSize: 12, color: '#777' },
  imagemItem: { width: 60, height: 60, borderRadius: 8 },
});
