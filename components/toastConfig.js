import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const toastConfig = {
  success: ({ text1 }) => (
    <View style={styles.toastContainer}>
      <Ionicons name="checkmark-circle" size={24} color="#05C7F2" />
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  toastText: {
    marginLeft: 10,
    color: '#05C7F2',
    fontWeight: 'bold',
    fontSize: 16,
  },
});