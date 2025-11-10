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
          <Ionicons name="mail-outline" size={18} color="#b6c0cf" />
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
          <Ionicons name="lock-closed-outline" size={18} color="#b6c0cf" />
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
              size={18}
              color="#b6c0cf"
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
            Don't have an account?{' '}
            <Text style={{ color: '#4f8cff', fontWeight: '600' }}>Sign up</Text>
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
    backgroundColor: '#0f1115',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#171a21',
    padding: 26,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 8,
  },

  sub: {
    textAlign: 'center',
    color: '#b6c0cf',
    marginBottom: 30,
    fontSize: 14,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1115',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#ffffff',
  },

  button: {
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  switchText: {
    textAlign: 'center',
    color: '#b6c0cf',
    fontSize: 14,
  },
});
