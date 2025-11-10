import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SignupScreen = () => {
  const navigation = useNavigation<any>();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const fade = new Animated.Value(0);
  Animated.timing(fade, {
    toValue: 1,
    duration: 800,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return Alert.alert('Error', 'All fields are required');
    }

    const res = await signup(name, email, password);
    console.log('Signup response →', res);

    if (res?.success === true) {
      Alert.alert('Success', res.message || 'Account created!');
      navigation.navigate('Login');
    } else {
      Alert.alert('Signup Failed', res.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fade }]}>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.sub}>Your store, your control</Text>

        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 18 }}
        >
          <Text style={styles.switchText}>
            Already have an account?{' '}
            <Text style={{ color: '#4c6ef5' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SignupScreen;

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
