import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores';
import { Avatar, Button, Card, Input } from '../../src/components/ui';

export default function ProfileSettings() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState('Passionate digital artist & visual storyteller.');

    const handleSave = () => {
        // In a real app, this would update the store/backend
        Alert.alert('Success', 'Profile updated successfully', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border-light dark:border-dark-tertiary bg-background-primary dark:bg-dark-card">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">Edit Profile</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-primary-600 font-bold text-base">Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Avatar Section */}
                <View className="items-center mb-6">
                    <View className="relative">
                        <Avatar source={user?.avatar} name={name} size="xl" />
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2 border-2 border-white dark:border-dark-primary">
                            <Ionicons name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-primary-600 font-medium mt-3">Change Profile Photo</Text>
                </View>

                {/* Form Fields */}
                <Card variant="outlined" padding="lg">
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">Full Name</Text>
                        <Input
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">Email Address</Text>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-text-secondary dark:text-gray-400 mb-2">Bio</Text>
                        <View className="bg-background-tertiary dark:bg-dark-tertiary rounded-xl p-3 h-24">
                            <TextInput
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                placeholder="Tell us about yourself..."
                                className="text-text-primary dark:text-text-inverse h-full"
                                textAlignVertical="top"
                                placeholderTextColor="#94a3b8"
                            />
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
