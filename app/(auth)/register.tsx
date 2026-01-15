import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore, useThemeStore } from '../../src/stores';
import { Input } from '../../src/components/ui';
import { UserRole } from '../../src/types';

const colors = {
  light: {
    background: '#F2F2F2',
    card: '#ffffff',
    text: '#1E1E1E',
    textSecondary: '#4A4A4A',
    textTertiary: '#757575',
    border: '#E0E0E0',
    backButton: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#374151',
    inputIcon: '#9ca3af',
    errorBg: '#fef2f2',
    errorBorder: '#fecaca',
    errorText: '#dc2626',
    roleUnselectedBg: '#ffffff',
    roleUnselectedBorder: '#e2e8f0',
    roleUnselectedText: '#64748b',
    roleUnselectedIcon: '#94a3b8',
  },
  dark: {
    background: '#121212',
    card: '#1F1F1F',
    text: '#EDEDED',
    textSecondary: '#B0B0B0',
    textTertiary: '#757575',
    border: '#2A2A2A',
    backButton: 'rgba(45, 45, 45, 0.9)',
    iconColor: '#E0E0E0',
    inputIcon: '#757575',
    errorBg: '#2d1f1f',
    errorBorder: '#5c2828',
    errorText: '#f87171',
    roleUnselectedBg: '#1F1F1F',
    roleUnselectedBorder: '#2A2A2A',
    roleUnselectedText: '#9ca3af',
    roleUnselectedIcon: '#6b7280',
  },
};

const roleOptions: { role: UserRole; label: string; description: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { role: 'artist', label: 'Artist', description: 'Create & verify artwork', icon: 'brush', color: '#D97757' },
  { role: 'agent', label: 'Agent / Buyer', description: 'Discover & collect art', icon: 'images', color: '#3A7DFF' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();
  const { effectiveTheme } = useThemeStore();
  const theme = colors[effectiveTheme];
  const isDark = effectiveTheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('artist');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = register(name, email, password, selectedRole);

    setIsLoading(false);

    if (result.success) {
      router.replace(`/(${selectedRole})`);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Back Button */}
          <View style={{ paddingHorizontal: 24, paddingTop: 16, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: theme.backButton,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Ionicons name="arrow-back" size={22} color={theme.iconColor} />
            </TouchableOpacity>
          </View>

          {/* Logo & Branding Section */}
          <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24, alignItems: 'center' }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                shadowColor: '#3A7DFF',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
                marginBottom: 20,
              }}
            >
              <LinearGradient
                colors={['#3A7DFF', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="person-add" size={36} color="#ffffff" />
              </LinearGradient>
            </View>

            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: theme.text,
                letterSpacing: -0.5,
              }}
            >
              Create Account
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: theme.textSecondary,
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Join our community of artists and collectors
            </Text>
          </View>

          {/* Form Card */}
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: theme.card,
              borderRadius: 24,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 16,
              elevation: 4,
              borderWidth: isDark ? 1 : 0,
              borderColor: theme.border,
            }}
          >
            {/* Role Selection */}
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
              I am a...
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 20, gap: 12 }}>
              {roleOptions.map((option) => {
                const isSelected = selectedRole === option.role;
                return (
                  <TouchableOpacity
                    key={option.role}
                    onPress={() => setSelectedRole(option.role)}
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? option.color : theme.roleUnselectedBorder,
                      backgroundColor: isSelected
                        ? (isDark ? `${option.color}20` : `${option.color}10`)
                        : theme.roleUnselectedBg,
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons
                      name={option.icon}
                      size={28}
                      color={isSelected ? option.color : theme.roleUnselectedIcon}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        marginTop: 8,
                        fontWeight: '600',
                        color: isSelected ? option.color : theme.roleUnselectedText,
                      }}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        marginTop: 4,
                        color: isSelected ? theme.textSecondary : theme.textTertiary,
                        textAlign: 'center',
                      }}
                    >
                      {option.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              leftIcon={<Ionicons name="person-outline" size={20} color={theme.inputIcon} />}
            />

            <Input
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon={<Ionicons name="mail-outline" size={20} color={theme.inputIcon} />}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoCapitalize="none"
              autoComplete="new-password"
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.inputIcon} />}
              helperText="At least 6 characters"
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              autoCapitalize="none"
              autoComplete="new-password"
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.inputIcon} />}
            />

            {/* Error Message */}
            {error ? (
              <View
                style={{
                  backgroundColor: theme.errorBg,
                  borderWidth: 1,
                  borderColor: theme.errorBorder,
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="alert-circle" size={20} color={theme.errorText} style={{ marginRight: 10 }} />
                <Text style={{ color: theme.errorText, fontSize: 14, flex: 1 }}>{error}</Text>
              </View>
            ) : null}

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
              style={{
                marginTop: 4,
                shadowColor: '#3A7DFF',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <LinearGradient
                colors={isLoading ? ['#6b7280', '#4b5563'] : ['#3A7DFF', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" style={{ marginRight: 10 }} />
                ) : null}
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: 17,
                    letterSpacing: 0.3,
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
                Already have an account?{' '}
              </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={{ color: '#3A7DFF', fontWeight: '600', fontSize: 15 }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Footer */}
          <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
            <Text
              style={{
                color: theme.textTertiary,
                fontSize: 12,
                textAlign: 'center',
                lineHeight: 18,
              }}
            >
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
