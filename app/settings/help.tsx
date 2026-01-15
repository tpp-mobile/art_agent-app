import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../src/components/ui';

export default function HelpScreen() {
    const router = useRouter();

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@artagent.demo');
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
                <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">Help Center</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View className="items-center py-6 mb-6">
                    <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mb-4">
                        <Ionicons name="help" size={32} color="#059669" />
                    </View>
                    <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse text-center">
                        How can we help?
                    </Text>
                    <Text className="text-text-secondary text-center mt-2 px-4">
                        Find answers to common questions or contact our support team.
                    </Text>
                </View>

                <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-2">
                    FAQ
                </Text>
                <Card variant="outlined" padding="none" className="mb-6">
                    {[
                        'How does verification work?',
                        'Is my artwork safe?',
                        'What payment methods are supported?',
                        'How do I report a violation?'
                    ].map((question, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`flex-row items-center justify-between p-4 ${index !== 3 ? 'border-b border-border-light dark:border-dark-tertiary' : ''
                                }`}
                        >
                            <Text className="text-base text-text-primary dark:text-text-inverse flex-1 mr-2">{question}</Text>
                            <Ionicons name="chevron-down" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    ))}
                </Card>

                <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-2">
                    Contact Us
                </Text>
                <Card variant="elevated" padding="lg">
                    <Text className="text-base text-text-primary dark:text-text-inverse mb-4">
                        Still need help? Our support team is available 24/7.
                    </Text>
                    <Button
                        title="Contact Support"
                        onPress={handleContactSupport}
                        icon={<Ionicons name="mail" size={20} color="white" />}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
