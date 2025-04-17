import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function bottomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { icon: 'home-sharp', path: '/home' },
    { icon: 'cart-sharp', path: '/cart' },
    { icon: 'receipt', path: '/status' },
    { icon: 'person-sharp', path: '/profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.path;
        const iconColor = isActive ? '#05C7F2' : 'rgba(0,191,255,0.15)';

        return (
          <TouchableOpacity
            key={index}
            style={styles.iconWrapper}
            onPress={() => router.replace(tab.path)}
          >
            <Ionicons name={tab.icon} size={28} color={iconColor} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
