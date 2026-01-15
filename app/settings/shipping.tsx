import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../src/components/ui';

export default function ShippingSettings() {
    const router = useRouter();

    const handleAddAddress = () => {
        Alert.alert('Coming Soon', 'Address management is not enabled in this demo.');
    };

    return (
        <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-border-light dark:border-dark-tertiary bg-background-primary dark:bg-dark-card">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color="#64748b" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">Shipping Address</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Saved Addresses */}
                <Card variant="outlined" padding="md" className="mb-4">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="home" size={18} color="#64748b" />
                            <Text className="text-base font-bold text-text-primary dark:text-text-inverse ml-2">Home</Text>
                            <View className="ml-2 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded">
                                <Text className="text-xs text-primary-700 dark:text-primary-400 font-medium">Default</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="pencil" size={18} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-text-secondary dark:text-gray-400 mt-1">123 Gallery Lane</Text>
                    <Text className="text-text-secondary dark:text-gray-400">San Francisco, CA 94103</Text>
                    <Text className="text-text-secondary dark:text-gray-400">United States</Text>
                </Card>

                {/* Add New */}
                <Button
                    title="Add New Address"
                    variant="outline"
                    onPress={handleAddAddress}
                    icon={<Ionicons name="add" size={20} color="#059669" />}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
