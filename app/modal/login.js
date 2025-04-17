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
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { loginUser } from '../../src/database/userRepository'; // ou '@/database/userRepository' se usar alias
import * as SecureStore from 'expo-secure-store';

const { height } = Dimensions.get('window');

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const translateY = useRef(new Animated.Value(0)).current;

  const fecharModalAnimado = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      alert('Preencha todos os campos.');
      return;
    }

    const sucesso = await loginUser(email, senha);

    if (email === 'admin' && senha === '123') {
      await SecureStore.setItemAsync('admin', 'true');
      fecharModalAnimado();
      setTimeout(() => {
        router.replace('/admin'); // redireciona para a tela do admin
      }, 300);
    } else if (sucesso) {
      await SecureStore.setItemAsync('userEmail', email);
      fecharModalAnimado();
      setTimeout(() => {
        router.replace('/home'); // redireciona para a tela principal
      }, 300);
    } else {
      alert('Login inválido. Verifique o e-mail e a senha.');
    }
  };

  return (
    <View style={styles.backdrop}>
      <Pressable style={styles.touchArea} onPress={fecharModalAnimado} />

      <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
        <View style={styles.tab}>
          <TouchableOpacity onPress={() => router.replace('/modal/register')}>
            <Text style={styles.inactiveTab}>Criar conta</Text>
          </TouchableOpacity>
          <Text style={styles.activeTab}>Login</Text>
        </View>

        <TextInput
          placeholder="E-mail"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  touchArea: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    height: height * 0.6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  activeTab: {
    marginLeft: 20,
    fontWeight: 'bold',
    color: '#05C7F2',
    fontSize: 16,
  },
  inactiveTab: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#05C7F2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
