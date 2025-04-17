import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Pressable,
    Animated,
  } from 'react-native';
  import { useRef, useState, useEffect } from 'react';
  import { router } from 'expo-router';
  import * as SecureStore from 'expo-secure-store';
  
  const { height } = Dimensions.get('window');
  
  export default function EditarEndereco() {
    const translateY = useRef(new Animated.Value(height)).current;
    const [endereco, setEndereco] = useState('');
  
    useEffect(() => {
      const carregarEndereco = async () => {
        const salvo = await SecureStore.getItemAsync('userEndereco');
        if (salvo) setEndereco(salvo);
      };
      carregarEndereco();
  
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, []);
  
    const fecharModal = () => {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.back();
      });
    };
  
    const salvar = async () => {
      await SecureStore.setItemAsync('userEndereco', endereco);
      fecharModal();
    };
  
    return (
      <View style={styles.backdrop}>
        <Pressable style={styles.touchArea} onPress={fecharModal} />
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
          <Text style={styles.titulo}>Alterar Endereço</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu endereço"
            value={endereco}
            onChangeText={setEndereco}
          />
          <TouchableOpacity onPress={salvar} style={styles.botao}>
            <Text style={styles.botaoTexto}>Salvar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' },
    touchArea: { flex: 1 },
    modalContainer: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
      height: height * 0.4,
      elevation: 8,
    },
    titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    botao: {
      backgroundColor: '#05C7F2',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  });
  