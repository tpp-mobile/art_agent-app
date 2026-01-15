import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../src/stores';
import { Input } from '../../src/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithCredentials } = useAuthStore();

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
    <SafeAreaView className="flex-1 bg-background-secondary">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-6 pt-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-background-primary rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Logo & Title */}
          <View className="px-6 pt-8 pb-6">
            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 bg-primary-500 rounded-xl items-center justify-center">
                <Ionicons name="shield-checkmark" size={28} color="#ffffff" />
              </View>
              <Text className="text-2xl font-bold text-text-primary ml-3">
                Art Agent
              </Text>
            </View>

            <Text className="text-3xl font-bold text-text-primary">
              Welcome Back
            </Text>
            <Text className="text-text-secondary mt-2">
              Sign in to continue to your account
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 py-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon={<Ionicons name="mail-outline" size={20} color="#94a3b8" />}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoCapitalize="none"
              autoComplete="password"
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />}
            />

            {error ? (
              <View className="bg-error/10 border border-error rounded-lg p-3 mb-4">
                <Text className="text-error text-sm">{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
              style={{ marginTop: 8, opacity: isLoading ? 0.6 : 1 }}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 12, padding: 16 }}
              >
                <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-text-secondary">Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-500 font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Demo Credentials */}
          <View className="px-6 py-6">
            <View className="border-t border-border-light pt-6">
              <Text className="text-text-tertiary text-center mb-4">
                Quick Login with Demo Credentials
              </Text>

              <View className="flex-row justify-center flex-wrap">
                <TouchableOpacity
                  onPress={() => fillDemoCredentials('artist')}
                  style={{ backgroundColor: '#dcfce7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, margin: 4 }}
                >
                  <Text style={{ color: '#15803d', fontWeight: '500' }}>Artist</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => fillDemoCredentials('agent')}
                  style={{ backgroundColor: '#dbeafe', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, margin: 4 }}
                >
                  <Text style={{ color: '#1d4ed8', fontWeight: '500' }}>Agent / Buyer</Text>
                </TouchableOpacity>
              </View>

              <Text className="text-text-tertiary text-xs text-center mt-4">
                Password for all demo accounts: demo123
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
