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
import { UserRole } from '../../src/types';

const roleOptions: { role: UserRole; label: string; description: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { role: 'artist', label: 'Artist', description: 'Create & verify artwork', icon: 'brush', color: '#10b981' },
  { role: 'agent', label: 'Agent / Buyer', description: 'Discover & collect art', icon: 'images', color: '#3b82f6' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();

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
              Create Account
            </Text>
            <Text className="text-text-secondary mt-2">
              Join our community of verified artists and collectors
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 py-4">
            {/* Role Selection */}
            <Text className="text-sm font-medium text-text-primary mb-3">
              I am a...
            </Text>
            <View className="flex-row mb-6" style={{ gap: 12 }}>
              {roleOptions.map((option) => (
                <TouchableOpacity
                  key={option.role}
                  onPress={() => setSelectedRole(option.role)}
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedRole === option.role ? option.color : '#e2e8f0',
                    backgroundColor: selectedRole === option.role ? `${option.color}10` : '#ffffff',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons
                    name={option.icon}
                    size={28}
                    color={selectedRole === option.role ? option.color : '#94a3b8'}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      marginTop: 8,
                      fontWeight: '600',
                      color: selectedRole === option.role ? option.color : '#64748b',
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 4,
                      color: selectedRole === option.role ? '#64748b' : '#94a3b8',
                      textAlign: 'center',
                    }}
                  >
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              leftIcon={<Ionicons name="person-outline" size={20} color="#94a3b8" />}
            />

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
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoCapitalize="none"
              autoComplete="new-password"
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />}
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
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />}
            />

            {error ? (
              <View className="bg-error/10 border border-error rounded-lg p-3 mb-4">
                <Text className="text-error text-sm">{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleRegister}
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
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-text-secondary">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-500 font-semibold">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Footer */}
          <View className="px-6 py-6">
            <Text className="text-text-tertiary text-xs text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
