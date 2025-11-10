// src/screens/admin/ProfileScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../context/StoreContext'; // ✅ ADDED
import Icon from 'react-native-vector-icons/Feather';

type ProfileForm = {
  storeName: string;
  ownerName: string;
  type: string;
  email: string;
  photoUri?: string | null;
};

const STORE_TYPES = [
  'Groceries Store',
  'Dairy',
  'Pharmacy',
  'Bakery',
  'Stationery',
  'Electronics',
  'Other',
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>(); // ✅ ADDED
  const { logout } = useStore(); // ✅ ADDED

  const [form, setForm] = useState<ProfileForm>({
    storeName: '',
    ownerName: '',
    type: '',
    email: '',
    photoUri: null,
  });

  const [isTypePickerOpen, setTypePickerOpen] = useState(false);
  const [isPwdModalOpen, setPwdModalOpen] = useState(false);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => {
    return (
      form.storeName.trim().length > 1 &&
      form.ownerName.trim().length > 1 &&
      form.type.trim().length > 0 &&
      form.email.trim().length > 3
    );
  }, [form]);

  function onChange<K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K],
  ) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function onPickPhoto() {
    Alert.alert('Pick Photo', 'Integrate your image picker here.');
  }

  async function onSaveProfile() {
    try {
      if (!canSave) {
        Alert.alert('Incomplete', 'Please fill all required fields.');
        return;
      }

      setSaving(true);

      Alert.alert('Saved', 'Your profile was updated.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function onChangePassword() {
    try {
      if (!oldPwd || !newPwd) {
        Alert.alert('Missing', 'Please enter both old and new passwords.');
        return;
      }

      setPwdModalOpen(false);
      setOldPwd('');
      setNewPwd('');

      Alert.alert('Password Updated', 'Your password has been changed.');
    } catch (e) {
      Alert.alert('Error', 'Failed to change password.');
    }
  }

  // ✅ LOGOUT FUNCTIONALITY
  function handleLogout() {
    logout(); // clear user data from context
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], // go to login screen
    });
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header card */}
          <View style={styles.cardHero}>
            <Pressable onPress={onPickPhoto} style={styles.avatarWrap}>
              {/* <Image
                source={
                  form.photoUri
                    ? { uri: form.photoUri }
                    : require('../../assets/avatar-placeholder.png')
                }
                style={styles.avatar}
              /> */}
              <View style={styles.avatarEdit}>
                <Icon name="camera" size={16} />
              </View>
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>
                {form.storeName || 'Your Store'}
              </Text>
              <Text style={styles.heroSub}>
                {form.type || 'Select Type'} • {form.ownerName || 'Owner'}
              </Text>
            </View>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Business Info</Text>

            <LabeledInput
              label="Store Name"
              value={form.storeName}
              onChangeText={t => onChange('storeName', t)}
              placeholder="e.g., Fresh Mart"
            />

            <LabeledInput
              label="Owner Name"
              value={form.ownerName}
              onChangeText={t => onChange('ownerName', t)}
              placeholder="e.g., Rohan Sharma"
            />

            <Pressable
              onPress={() => setTypePickerOpen(true)}
              style={styles.select}
            >
              <Text style={styles.selectLabel}>Type</Text>
              <View style={styles.selectRow}>
                <Text style={styles.selectValue}>
                  {form.type || 'Select store type'}
                </Text>
                <Icon name="chevron-right" size={18} />
              </View>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account</Text>

            <LabeledInput
              label="Email"
              value={form.email}
              onChangeText={t => onChange('email', t)}
              placeholder="you@store.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Pressable
              onPress={() => setPwdModalOpen(true)}
              style={styles.inlineButton}
            >
              <Icon name="lock" size={16} />
              <Text style={styles.inlineButtonText}>Change Password</Text>
            </Pressable>
          </View>

          <Pressable
            disabled={!canSave || saving}
            onPress={onSaveProfile}
            style={[styles.saveBtn, (!canSave || saving) && { opacity: 0.6 }]}
          >
            <Text style={styles.saveBtnText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </Pressable>

          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Type Picker Modal */}
      <Modal
        visible={isTypePickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setTypePickerOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setTypePickerOpen(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Select Store Type</Text>
          {STORE_TYPES.map(t => (
            <Pressable
              key={t}
              onPress={() => {
                onChange('type', t);
                setTypePickerOpen(false);
              }}
              style={styles.sheetRow}
            >
              <Text style={styles.sheetRowText}>{t}</Text>
              {form.type === t ? <Icon name="check" size={18} /> : null}
            </Pressable>
          ))}
        </View>
      </Modal>

      {/* Password Modal */}
      <Modal
        visible={isPwdModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setPwdModalOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setPwdModalOpen(false)}
        />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Change Password</Text>
          <TextInput
            style={styles.input}
            value={oldPwd}
            onChangeText={setOldPwd}
            placeholder="Old password"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={newPwd}
            onChangeText={setNewPwd}
            placeholder="New password"
            secureTextEntry
          />
          <Pressable onPress={onChangePassword} style={styles.modalBtn}>
            <Text style={styles.modalBtnText}>Update Password</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

function LabeledInput(props: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType}
        autoCapitalize={props.autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  content: { padding: 16 },
  cardHero: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#171a21',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },
  avatarWrap: { width: 72, height: 72, borderRadius: 16, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  avatarEdit: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  heroTitle: { color: 'white', fontSize: 20, fontWeight: '700' },
  heroSub: { color: '#b6c0cf', marginTop: 4 },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#171a21',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: { color: '#b6c0cf', marginBottom: 8 },
  input: {
    backgroundColor: '#0f1115',
    color: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },
  select: {
    marginTop: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0f1115',
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },
  selectLabel: { color: '#b6c0cf', marginBottom: 6 },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValue: { color: 'white' },
  inlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#0f1115',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2f3a',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  inlineButtonText: { color: 'white', fontWeight: '600' },
  saveBtn: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#4f8cff',
  },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },

  // Type sheet
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#171a21',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    backgroundColor: '#2a2f3a',
    borderRadius: 2,
    marginVertical: 10,
  },
  sheetTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sheetRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2f3a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetRowText: { color: 'white' },

  // Password modal
  modalCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: '25%',
    backgroundColor: '#171a21',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },
  modalTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalBtn: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#4f8cff',
  },
  modalBtnText: { color: 'white', fontWeight: '700' },
  logoutBtn: {
    marginTop: 12,
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#171a21',
    fontWeight: '700',
    fontSize: 16,
  },
});
