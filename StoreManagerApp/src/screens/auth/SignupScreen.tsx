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
          <Ionicons name="person-outline" size={18} color="#b6c0cf" />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={18} color="#b6c0cf" />
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
          <Ionicons name="lock-closed-outline" size={18} color="#b6c0cf" />
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
              size={18}
              color="#b6c0cf"
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
            <Text style={{ color: '#4f8cff', fontWeight: '600' }}>Login</Text>
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
