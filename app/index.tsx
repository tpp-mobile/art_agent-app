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
import { useAuthStore, useThemeStore } from '../src/stores';

const colors = {
  light: {
    background: '#FFFDF9',
    card: '#ffffff',
    cardAlt: '#F8FAFC',
    text: '#1E1E1E',
    textSecondary: '#4A4A4A',
    textTertiary: '#757575',
    border: '#E0E0E0',
    featureBg: '#EFF6FF',
    featureIcon: '#3A7DFF',
    infoBg: '#EFF6FF',
    infoBorder: '#BFDBFE',
    infoTitle: '#1D4ED8',
    infoText: '#2563EB',
    buttonOutline: '#3A7DFF',
  },
  dark: {
    background: '#121212',
    card: '#1F1F1F',
    cardAlt: '#1A1A1A',
    text: '#EDEDED',
    textSecondary: '#B0B0B0',
    textTertiary: '#757575',
    border: '#2A2A2A',
    featureBg: '#1a2435',
    featureIcon: '#60A5FA',
    infoBg: '#1a2435',
    infoBorder: '#2d3f5c',
    infoTitle: '#60A5FA',
    infoText: '#93C5FD',
    buttonOutline: '#3A7DFF',
  },
};

export default function LandingScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { effectiveTheme } = useThemeStore();
  const theme = colors[effectiveTheme];
  const isDark = effectiveTheme === 'dark';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <LinearGradient
              colors={['#3A7DFF', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="color-palette" size={24} color="#ffffff" />
            </LinearGradient>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: theme.text,
              }}
            >
              Art Agent
            </Text>
          </View>

          <Text
            style={{
              fontSize: 36,
              fontWeight: '700',
              color: theme.text,
              marginTop: 24,
              lineHeight: 44,
            }}
          >
            Verify Human{'\n'}Creativity
          </Text>

          <Text
            style={{
              fontSize: 17,
              color: theme.textSecondary,
              marginTop: 16,
              lineHeight: 26,
            }}
          >
            In the age of AI, prove the authenticity of human-created art with
            blockchain-backed verification certificates.
          </Text>
        </View>

        {/* Features */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {[
              { icon: 'scan', label: 'AI Detection' },
              { icon: 'layers', label: 'Layer Analysis' },
              { icon: 'videocam', label: 'Timelapse Proof' },
              { icon: 'ribbon', label: 'Certificates' },
            ].map((feature, index) => (
              <View
                key={index}
                style={{
                  width: '50%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: theme.featureBg,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name={feature.icon as keyof typeof Ionicons.glyphMap}
                    size={18}
                    color={theme.featureIcon}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.textSecondary,
                    marginLeft: 10,
                  }}
                >
                  {feature.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* User Roles Info */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: theme.text,
              marginBottom: 16,
            }}
          >
            Who's it for?
          </Text>

          <View>
            {[
              {
                icon: 'brush',
                title: 'Artists',
                description: 'Upload and verify your artwork to prove human creation',
                color: '#D97757',
              },
              {
                icon: 'images',
                title: 'Agents / Buyers',
                description: 'Discover, verify, and collect authentic human-created artworks',
                color: '#3A7DFF',
              },
            ].map((role, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.card,
                  padding: 16,
                  borderRadius: 16,
                  marginBottom: 12,
                  borderWidth: isDark ? 1 : 0,
                  borderColor: theme.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.2 : 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDark ? `${role.color}30` : `${role.color}15`,
                  }}
                >
                  <Ionicons
                    name={role.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={role.color}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      color: theme.text,
                      fontWeight: '600',
                      fontSize: 16,
                    }}
                  >
                    {role.title}
                  </Text>
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontSize: 14,
                      marginTop: 2,
                    }}
                  >
                    {role.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Auth Buttons */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                shadowColor: '#3A7DFF',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <LinearGradient
                colors={['#3A7DFF', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 14,
                  paddingVertical: 16,
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 17,
                  }}
                >
                  Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>

          <Link href="/(auth)/register" asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                marginTop: 12,
                borderWidth: 2,
                borderColor: theme.buttonOutline,
                borderRadius: 14,
                paddingVertical: 16,
                backgroundColor: isDark ? 'rgba(58, 125, 255, 0.1)' : 'transparent',
              }}
            >
              <Text
                style={{
                  color: theme.buttonOutline,
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 17,
                }}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Demo Credentials Info */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 16, marginBottom: 16 }}>
          <View
            style={{
              backgroundColor: theme.infoBg,
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.infoBorder,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="information-circle" size={20} color={theme.infoTitle} />
              <Text
                style={{
                  color: theme.infoTitle,
                  fontWeight: '600',
                  marginLeft: 8,
                  fontSize: 15,
                }}
              >
                Demo Credentials
              </Text>
            </View>
            <Text
              style={{
                color: theme.infoText,
                fontSize: 14,
                lineHeight: 22,
              }}
            >
              Try the app with these demo accounts:{'\n'}
              {'\n'}
              <Text style={{ fontWeight: '600' }}>Artist:</Text> artist@demo.com{'\n'}
              <Text style={{ fontWeight: '600' }}>Agent / Buyer:</Text> agent@demo.com{'\n'}
              {'\n'}
              Password for all: <Text style={{ fontWeight: '600' }}>demo123</Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 32, alignItems: 'center' }}>
          <Text
            style={{
              color: theme.textTertiary,
              fontSize: 13,
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            Trusted by artists and collectors worldwide.{'\n'}
            Bank-grade security. Gallery-quality curation.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
