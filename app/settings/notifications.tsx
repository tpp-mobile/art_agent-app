import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui';

export default function NotificationSettings() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        pushEnabled: true,
        emailEnabled: true,
        marketingEnabled: false,
        newFollower: true,
        salesUpdates: true,
        securityAlerts: true,
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-border-light dark:border-dark-tertiary bg-background-primary dark:bg-dark-card">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3"
                >
                    <Ionicons name="arrow-back" size={24} color="#64748b" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">Notifications</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-2">
                    General
                </Text>
                <Card variant="outlined" padding="none" className="mb-6">
                    <View className="flex-row items-center justify-between p-4 border-b border-border-light dark:border-dark-tertiary">
                        <View>
                            <Text className="text-base font-medium text-text-primary dark:text-text-inverse">Push Notifications</Text>
                            <Text className="text-sm text-text-tertiary">Receive alerts on this device</Text>
                        </View>
                        <Switch
                            value={settings.pushEnabled}
                            onValueChange={() => toggleSwitch('pushEnabled')}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                        />
                    </View>
                    <View className="flex-row items-center justify-between p-4">
                        <View>
                            <Text className="text-base font-medium text-text-primary dark:text-text-inverse">Email Notifications</Text>
                            <Text className="text-sm text-text-tertiary">Receive updates via email</Text>
                        </View>
                        <Switch
                            value={settings.emailEnabled}
                            onValueChange={() => toggleSwitch('emailEnabled')}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                        />
                    </View>
                </Card>

                <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-2">
                    Activity
                </Text>
                <Card variant="outlined" padding="none" className="mb-6">
                    <View className="flex-row items-center justify-between p-4 border-b border-border-light dark:border-dark-tertiary">
                        <Text className="text-base text-text-primary dark:text-text-inverse">New Followers</Text>
                        <Switch
                            value={settings.newFollower}
                            onValueChange={() => toggleSwitch('newFollower')}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                        />
                    </View>
                    <View className="flex-row items-center justify-between p-4 border-b border-border-light dark:border-dark-tertiary">
                        <Text className="text-base text-text-primary dark:text-text-inverse">Sales & Offers</Text>
                        <Switch
                            value={settings.salesUpdates}
                            onValueChange={() => toggleSwitch('salesUpdates')}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                        />
                    </View>
                    <View className="flex-row items-center justify-between p-4">
                        <Text className="text-base text-text-primary dark:text-text-inverse">Security Alerts</Text>
                        <Switch
                            value={settings.securityAlerts}
                            onValueChange={() => toggleSwitch('securityAlerts')}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                        />
                    </View>
                </Card>

                <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-2">
                    Updates
                </Text>
                <Card variant="outlined" padding="none">
                    <View className="flex-row items-center justify-between p-4">
                        <View>
                            <Text className="text-base font-medium text-text-primary dark:text-text-inverse">Marketing & News</Text>
                            <Text className="text-sm text-text-tertiary">Product updates and promotions</Text>
                        </View>
                        <Switch
                            value={settings.marketingEnabled}
                            onValueChange={() => toggleSwitch('marketingEnabled')}
                            trackColor={{ false: '#e2e8f0', true: '#10b981' }}
                        />
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
