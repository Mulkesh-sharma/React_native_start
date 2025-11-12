import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, globalStyles } from '../../styles/globalStyles';

type ProfileData = {
  storeName: string;
  ownerName: string;
  type: string;
  email: string;
  photoUri?: string | null;
};

export default function ProfileScreenMain() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { token, userData, logout } = useAuth();
  
  const [profile, setProfile] = useState<ProfileData>({
    storeName: userData?.storeName || 'My Store',
    ownerName: userData?.name || 'Store Owner',
    type: userData?.storeType || 'Retail',
    email: userData?.email || 'store@example.com',
    photoUri: userData?.photoURL || null,
  });

  // In a real app, you would fetch this from your backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;
        
        // TODO: Uncomment and implement actual API call
        // const response = await fetchUserProfile(token);
        // if (response.success) {
        //   setProfile({
        //     storeName: response.data.storeName,
        //     ownerName: response.data.ownerName,
        //     type: response.data.type,
        //     email: response.data.email,
        //     photoUri: response.data.photoUri,
        //   });
        // }
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Use default values from userData if available
        if (userData) {
          setProfile({
            storeName: userData.storeName || 'My Store',
            ownerName: userData.name || 'Store Owner',
            type: userData.storeType || 'Retail',
            email: userData.email || 'store@example.com',
            photoUri: userData.photoURL || null,
          });
        }
      }
    };

    fetchProfile();
  }, [token, userData]);

  const handleEditProfile = () => {
    navigation.navigate('Profile');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={globalStyles.container}>
      <AppHeader title="My Profile" isHome={true} />
      <ScrollView 
        contentContainerStyle={[globalStyles.scrollContent, { padding: spacing.md }]}
        style={globalStyles.scrollView}
      >
        {/* Header card */}
        <View style={[globalStyles.card, styles.cardHero]}>
          <View style={styles.avatarWrap}>
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Icon name="store" size={40} color={colors.textSecondary} />
              </View>
            )}
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {profile.storeName || 'Your Store'}
            </Text>
            <Text style={styles.heroSub}>
              {profile.type || 'Store Type'} • {profile.ownerName || 'Owner'}
            </Text>
          </View>
        </View>

        {/* Profile Info Card */}
        <View style={globalStyles.card}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Store Name</Text>
            <Text style={styles.infoValue}>{profile.storeName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Owner Name</Text>
            <Text style={styles.infoValue}>{profile.ownerName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Store Type</Text>
            <Text style={styles.infoValue}>{profile.type}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{profile.email}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <Pressable 
          style={[globalStyles.primaryButton, styles.actionButton]}
          onPress={handleEditProfile}
        >
          <Text style={globalStyles.primaryButtonText}>Edit Profile</Text>
          <Icon name="edit-3" size={18} color={colors.text} style={styles.buttonIcon} />
        </Pressable>

        <Pressable 
          style={[styles.logoutButton, { borderColor: colors.error }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutButtonText, { color: colors.error }]}>Logout</Text>
          <Icon name="log-out" size={18} color={colors.error} style={styles.buttonIcon} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardHero: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  heroContent: {
    flex: 1,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroTitle: {
    ...globalStyles.title,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  heroSub: {
    ...globalStyles.text,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...globalStyles.title,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  infoLabel: {
    ...globalStyles.text,
    color: colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    ...globalStyles.text,
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'right',
  },
  actionButton: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginBottom: spacing.md,
  },
  logoutButtonText: {
    ...globalStyles.primaryButtonText,
    color: colors.error,
  },
  buttonIcon: {
    marginLeft: spacing.sm,
  },
});
