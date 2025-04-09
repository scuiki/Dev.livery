import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../assets/logo.svg';
import Fundo from '../assets/fundo.svg';

const { width } = Dimensions.get('window');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.topBackground}>
        <Fundo width={width} height={250} style={{ position: 'absolute' }} />

        <LinearGradient
        colors={['rgba(255,255,255,0)', '#fff']}
        style={styles.gradientOverlay}
        pointerEvents="none"
        />
      </View>

      <View style={styles.logoContainer}>
        <Logo width={300} height={120} />
      </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/modal/login')}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/modal/register')}>
            <Text style={styles.buttonText}>Cadastro</Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  logoContainer: {
    marginTop: 100,
    marginBottom: 80,
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 400,
    height: 250,
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 250,
  },
});
