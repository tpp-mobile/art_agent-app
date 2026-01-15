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
    divider: '#e5e7eb',
    demoBgArtist: '#ecfdf5',
    demoBorderArtist: '#a7f3d0',
    demoBgAgent: '#eff6ff',
    demoBorderAgent: '#bfdbfe',
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
    divider: '#2A2A2A',
    demoBgArtist: '#1a2f1a',
    demoBorderArtist: '#2d4a2d',
    demoBgAgent: '#1a2435',
    demoBorderAgent: '#2d3f5c',
  },
};

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithCredentials } = useAuthStore();
  const { effectiveTheme } = useThemeStore();
  const theme = colors[effectiveTheme];
  const isDark = effectiveTheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = loginWithCredentials(email, password);

    setIsLoading(false);

    if (result.success) {
      const { user } = useAuthStore.getState();
      if (user) {
        router.replace(`/(${user.role})`);
      }
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const fillDemoCredentials = (role: 'artist' | 'agent') => {
    const credentials = {
      artist: { email: 'artist@demo.com', password: 'demo123' },
      agent: { email: 'agent@demo.com', password: 'demo123' },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setError('');
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
          <View style={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32, alignItems: 'center' }}>
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
                <Ionicons name="color-palette" size={36} color="#ffffff" />
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
              Welcome Back
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: theme.textSecondary,
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Sign in to continue to Art Agent
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoCapitalize="none"
              autoComplete="password"
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.inputIcon} />}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginTop: -8, marginBottom: 16 }}
            >
              <Text style={{ fontSize: 14, color: '#3A7DFF', fontWeight: '500' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

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

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
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
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 15 }}>
                Don't have an account?{' '}
              </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text style={{ color: '#3A7DFF', fontWeight: '600', fontSize: 15 }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Demo Credentials Section */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
              <Text
                style={{
                  paddingHorizontal: 16,
                  color: theme.textTertiary,
                  fontSize: 13,
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Demo Access
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: theme.divider }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
              <TouchableOpacity
                onPress={() => fillDemoCredentials('artist')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.demoBgArtist,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.demoBorderArtist,
                }}
              >
                <Ionicons name="brush-outline" size={18} color="#10b981" style={{ marginRight: 8 }} />
                <Text style={{ color: '#10b981', fontWeight: '600', fontSize: 14 }}>
                  Artist
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => fillDemoCredentials('agent')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.demoBgAgent,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.demoBorderAgent,
                }}
              >
                <Ionicons name="briefcase-outline" size={18} color="#3b82f6" style={{ marginRight: 8 }} />
                <Text style={{ color: '#3b82f6', fontWeight: '600', fontSize: 14 }}>
                  Agent
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: theme.textTertiary,
                fontSize: 12,
                textAlign: 'center',
                marginTop: 16,
              }}
            >
              Demo password: demo123
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
