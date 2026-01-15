import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/stores';

export default function LandingScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const route = `/(${user.role})` as const;
      setTimeout(() => {
        router.replace(route);
      }, 0);
    }
  }, [isAuthenticated, user]);

  return (
    <SafeAreaView className="flex-1 bg-background-secondary">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="px-6 pt-8 pb-6">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 bg-primary-500 rounded-xl items-center justify-center mr-3">
              <Ionicons name="shield-checkmark" size={24} color="#ffffff" />
            </View>
            <Text className="text-2xl font-bold text-text-primary">Art Agent</Text>
          </View>

          <Text className="text-4xl font-bold text-text-primary mt-6 leading-tight">
            Verify Human{'\n'}Creativity
          </Text>

          <Text className="text-lg text-text-secondary mt-4 leading-relaxed">
            In the age of AI, prove the authenticity of human-created art with
            blockchain-backed verification certificates.
          </Text>
        </View>

        {/* Features */}
        <View className="px-6 py-4">
          <View className="flex-row flex-wrap">
            {[
              { icon: 'scan', label: 'AI Detection' },
              { icon: 'layers', label: 'Layer Analysis' },
              { icon: 'videocam', label: 'Timelapse Proof' },
              { icon: 'ribbon', label: 'Certificates' },
            ].map((feature, index) => (
              <View
                key={index}
                className="w-1/2 flex-row items-center py-2"
              >
                <View className="w-8 h-8 bg-primary-100 rounded-lg items-center justify-center">
                  <Ionicons
                    name={feature.icon as keyof typeof Ionicons.glyphMap}
                    size={18}
                    color="#059669"
                  />
                </View>
                <Text className="text-sm text-text-secondary ml-2">
                  {feature.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Roles Info */}
        <View className="px-6 py-4">
          <Text className="text-xl font-bold text-text-primary mb-4">
            Who's it for?
          </Text>

          <View>
            {[
              {
                icon: 'brush',
                title: 'Artists',
                description: 'Upload and verify your artwork to prove human creation',
                color: '#10b981',
              },
              {
                icon: 'images',
                title: 'Agents / Buyers',
                description: 'Discover, verify, and collect authentic human-created artworks',
                color: '#3b82f6',
              },
            ].map((role, index) => (
              <View
                key={index}
                className="flex-row items-center bg-background-primary p-4 rounded-xl mb-3"
              >
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center"
                  style={{ backgroundColor: `${role.color}20` }}
                >
                  <Ionicons
                    name={role.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={role.color}
                  />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-text-primary font-semibold">{role.title}</Text>
                  <Text className="text-text-secondary text-sm">{role.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Auth Buttons */}
        <View className="px-6 py-6">
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity activeOpacity={0.9}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 12, padding: 16 }}
              >
                <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
                  Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>

          <Link href="/(auth)/register" asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              className="mt-3 border-2 border-primary-500 rounded-xl p-4"
            >
              <Text className="text-primary-500 text-center font-bold text-lg">
                Create Account
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Demo Credentials Info */}
        <View className="px-6 py-4 mb-4">
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
              <Text className="text-blue-700 dark:text-blue-400 font-semibold ml-2">
                Demo Credentials
              </Text>
            </View>
            <Text className="text-blue-600 dark:text-blue-300 text-sm">
              Try the app with these demo accounts:{'\n'}
              {'\n'}
              <Text className="font-medium">Artist:</Text> artist@demo.com{'\n'}
              <Text className="font-medium">Agent / Buyer:</Text> agent@demo.com{'\n'}
              {'\n'}
              Password for all: <Text className="font-medium">demo123</Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 py-8 items-center">
          <Text className="text-text-tertiary text-sm text-center">
            Trusted by artists and collectors worldwide.{'\n'}
            Bank-grade security. Gallery-quality curation.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
