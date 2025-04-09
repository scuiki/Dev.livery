import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Pressable, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { registerUser } from '../../src/database/userRepository';


const { height } = Dimensions.get('window');

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [celular, setCelular] = useState('');

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

  const handleRegister = async () => {
    if (!nome || !email || !celular || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  
    // Aguarda o banco terminar de liberar (resolve o database locked)
    await new Promise((res) => setTimeout(res, 100));
  
    const sucesso = await registerUser(nome, email, celular, senha);
  
    if (sucesso) {
      alert(`Conta criada com sucesso!`);
      fecharModalAnimado();
    } else {
      // O alerta já está sendo tratado no registerUser
    }
  };  

  return (
    <View style={styles.backdrop}>
      {/* área fora do modal que fecha ao clicar */}
      <Pressable style={styles.touchArea} onPress={fecharModalAnimado} />

      {/* conteúdo do modal com animação */}
      <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>

        <View style={styles.tab}>
          <Text style={styles.activeTab}>Criar conta</Text>
          <TouchableOpacity onPress={() => router.replace('/modal/login')}>
            <Text style={styles.inactiveTab}>Login</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Nome"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Celular"
          style={styles.input}
          keyboardType="phone-pad"
          value={celular}
          onChangeText={setCelular}
        />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
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

    // sombra para profundidade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00bfff',
    textAlign: 'center',
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  activeTab: {
    marginRight: 20,
    fontWeight: 'bold',
    color: '#00bfff',
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
    backgroundColor: '#00bfff',
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


