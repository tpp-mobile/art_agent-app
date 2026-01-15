import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui';

const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
];

export default function LanguageSettings() {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');

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
                <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">Language</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Card variant="outlined" padding="none">
                    {languages.map((lang, index) => (
                        <TouchableOpacity
                            key={lang.code}
                            onPress={() => setSelectedLanguage(lang.code)}
                            className={`flex-row items-center justify-between p-4 ${index !== languages.length - 1 ? 'border-b border-border-light dark:border-dark-tertiary' : ''
                                }`}
                        >
                            <Text className={`text-base ${selectedLanguage === lang.code
                                    ? 'font-bold text-primary-600 dark:text-primary-400'
                                    : 'text-text-primary dark:text-text-inverse'
                                }`}>
                                {lang.name}
                            </Text>
                            {selectedLanguage === lang.code && (
                                <Ionicons name="checkmark" size={20} color="#10b981" />
                            )}
                        </TouchableOpacity>
                    ))}
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
