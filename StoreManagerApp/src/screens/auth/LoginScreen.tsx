import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  // Fade animation
  const fade = new Animated.Value(0);
  Animated.timing(fade, {
    toValue: 1,
    duration: 800,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields required');
      return;
    }

    const res = await login(email, password);

    console.log('Login Response →', res);

    if (res?.success === true) {
      Alert.alert('Success', res.message);
    } else {
      Alert.alert('Login Failed', res.message || 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fade }]}>
        <Text style={styles.heading}>Welcome Back 👋</Text>
        <Text style={styles.sub}>Login to manage your store</Text>

        {/* Email */}
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Password */}
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={{ marginTop: 18 }}
        >
          <Text style={styles.switchText}>
            Don’t have an account?{' '}
            <Text style={{ color: '#4c6ef5' }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 26,
    borderRadius: 22,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  heading: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    color: '#4c6ef5',
  },

  sub: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 30,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },

  button: {
    backgroundColor: '#4c6ef5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  switchText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
});
