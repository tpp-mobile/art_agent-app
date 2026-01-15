import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../src/components/ui';

export default function PaymentSettings() {
    const router = useRouter();

    const handleAddMethod = () => {
        Alert.alert('Coming Soon', 'Payment integration is not yet enabled in this demo.');
    };

    return (
        <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-border-light dark:border-dark-tertiary bg-background-primary dark:bg-dark-card">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color="#64748b" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">Payment Methods</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Saved Cards */}
                <Text className="text-sm font-medium text-text-tertiary uppercase mb-2 px-2">
                    Saved Cards
                </Text>
                <Card variant="outlined" padding="none" className="mb-6">
                    <View className="p-4 border-b border-border-light dark:border-dark-tertiary flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-10 h-6 bg-blue-600 rounded mr-3 items-center justify-center">
                                <Text className="text-white text-[8px] font-bold">VISA</Text>
                            </View>
                            <View>
                                <Text className="text-base font-bold text-text-primary dark:text-text-inverse">•••• 4242</Text>
                                <Text className="text-xs text-text-tertiary">Expires 12/28</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-vertical" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                    <View className="p-4 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-10 h-6 bg-orange-500 rounded mr-3 items-center justify-center">
                                <Text className="text-white text-[8px] font-bold">MC</Text>
                            </View>
                            <View>
                                <Text className="text-base font-bold text-text-primary dark:text-text-inverse">•••• 8888</Text>
                                <Text className="text-xs text-text-tertiary">Expires 09/27</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="ellipsis-vertical" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Add New */}
                <Button
                    title="Add Payment Method"
                    variant="outline"
                    onPress={handleAddMethod}
                    icon={<Ionicons name="add" size={20} color="#059669" />}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
