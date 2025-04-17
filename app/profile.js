import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BottomTabs from '../components/bottomTabs';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { getCurrentUser } from '../src/database/userRepository';

export default function Profile() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      const dados = await getCurrentUser();
      if (dados) setUsuario(dados);
    };
  
    carregarDados();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userEmail');
    Alert.alert('Logout realizado', 'Você foi desconectado com sucesso.');
    router.replace('/'); // Redireciona para tela inicial (index.js)
  };

  if (!usuario) {
    return <Text style={styles.texto}>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.valor}>{usuario.nome}</Text>

      <Text style={styles.label}>E-mail:</Text>
      <Text style={styles.valor}>{usuario.email}</Text>

      <Text style={styles.label}>Celular:</Text>
      <Text style={styles.valor}>{usuario.celular}</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.botaoLogout}>
        <Text style={styles.textoLogout}>Logout</Text>
      </TouchableOpacity>

      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff', flex: 1 },
  label: { fontWeight: 'bold', fontSize: 20, color: '#000', marginTop: 12 },
  valor: { fontSize: 16, color: '#333', marginTop: 4 },
  texto: { padding: 24, textAlign: 'center', color: '#999' },
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
