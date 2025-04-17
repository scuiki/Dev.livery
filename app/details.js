import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addToCart } from '../src/database/cartRepository';

export default function Details() {
  const { nome, descricao, preco, imagemUri } = useLocalSearchParams();

  const handleAddToCart = async () => {
    try {
      await addToCart(
        String(nome),
        String(descricao),
        Number(preco),
        String(imagemUri)
      );
      Alert.alert('Sucesso', 'Item adicionado ao carrinho!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar ao carrinho.');
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imagemUri }} style={styles.imagem} />

      <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
        <Ionicons name="chevron-back" size={24} color="#05C7F2" />
      </TouchableOpacity>

      <View style={styles.conteudo}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.desc}>{descricao}</Text>
        <Text style={styles.preco}>R$ {Number(preco).toFixed(2)}</Text>

        <TouchableOpacity
            style={styles.botao}
            onPress={async () => {
                await addToCart(nome, descricao, Number(preco), imagemUri);
                alert('Item adicionado ao carrinho!');
            }}
            >
            <Text style={styles.botaoTexto}>Adicionar ao carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imagem: { width: '100%', height: 300, resizeMode: 'cover' },
  botaoVoltar: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
  conteudo: { padding: 24 },
  nome: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  desc: { fontSize: 14, color: '#666', marginBottom: 10 },
  preco: { fontSize: 16, fontWeight: 'bold', color: '#05C7F2', marginBottom: 20 },
  botao: {
    backgroundColor: '#05C7F2',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
