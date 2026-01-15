import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../src/components/ui';

export default function SecuritySettings() {
    const router = useRouter();
    const [biometrics, setBiometrics] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);

    const handleChangePassword = () => {
        Alert.alert('Change Password', 'An email with reset instructions has been sent to your registered address.');
    };

    return (
        <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-border-light dark:border-dark-tertiary bg-background-primary dark:bg-dark-card">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color="#64748b" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">Security</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-2">
                    Authentication
                </Text>
                <Card variant="outlined" padding="none" className="mb-6">
                    <TouchableOpacity
                        onPress={handleChangePassword}
                        className="flex-row items-center justify-between p-4 border-b border-border-light dark:border-dark-tertiary"
                    >
                        <View>
                            <Text className="text-base font-medium text-text-primary dark:text-text-inverse">Change Password</Text>
                            <Text className="text-sm text-text-tertiary">Last updated 3 months ago</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>

                    <View className="flex-row items-center justify-between p-4 border-b border-border-light dark:border-dark-tertiary">
                        <View>
                            <Text className="text-base font-medium text-text-primary dark:text-text-inverse">Face ID / Touch ID</Text>
                            <Text className="text-sm text-text-tertiary">Use biometrics to sign in</Text>
                        </View>
                        <Switch
                            value={biometrics}
                            onValueChange={setBiometrics}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                        />
                    </View>

                    <View className="flex-row items-center justify-between p-4">
                        <View>
                            <Text className="text-base font-medium text-text-primary dark:text-text-inverse">Two-Factor Authentication</Text>
                            <Text className="text-sm text-text-tertiary">Extra layer of security</Text>
                        </View>
                        <Switch
                            value={twoFactor}
                            onValueChange={setTwoFactor}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                        />
                    </View>
                </Card>

                <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-2">
                    Devices
                </Text>
                <Card variant="outlined" padding="md">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="phone-portrait" size={24} color="#64748b" />
                        <View className="ml-3 flex-1">
                            <Text className="text-base font-bold text-text-primary dark:text-text-inverse">iPhone 14 Pro</Text>
                            <Text className="text-sm text-text-secondary">This device • San Francisco, CA</Text>
                        </View>
                        <View className="w-2 h-2 rounded-full bg-green-500" />
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
