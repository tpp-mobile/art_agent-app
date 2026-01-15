import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore, useArtworkStore } from '../../src/stores';
import { showSuccess } from '../../src/stores/notificationStore';
import { Button, Card, Input } from '../../src/components/ui';
import { VerificationAnimation } from '../../src/components/verification';
import { ArtworkMedium, ProcessProof } from '../../src/types';

const mediumOptions: ArtworkMedium[] = [
  'Digital Painting',
  'Oil Painting',
  'Watercolor',
  'Photography',
  'Mixed Media',
  '3D Render',
  'Vector Art',
  'Sculpture',
];

export default function ArtworkUpload() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addArtwork } = useArtworkStore();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [medium, setMedium] = useState<ArtworkMedium | null>(null);
  const [tools, setTools] = useState('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [proofs, setProofs] = useState<ProcessProof[]>([]);

  const pickImage = async (type: 'main' | 'proof', proofType?: ProcessProof['type']) => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload artwork.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: type === 'main',
      aspect: type === 'main' ? [4, 3] : undefined,
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'main') {
        setImageUri(result.assets[0].uri);
      } else {
        // Add as process proof
        const newProof: ProcessProof = {
          id: Date.now().toString(),
          title: proofType === 'sketch' ? 'Sketch' : proofType === 'layer_structure' ? 'Layer Structure' : proofType === 'timelapse' ? 'Timelapse' : 'WIP Photo',
          fileName: result.assets[0].fileName || `proof_${proofs.length + 1}.jpg`,
          fileSize: 'unknown',
          thumbnail: result.assets[0].uri,
          verified: false,
          type: proofType || 'wip',
          uploadedAt: new Date(),
          metadata: {
            software: 'Unknown',
            layerCount: 0,
            duration: '0h 0m',
          }
        };
        setProofs([...proofs, newProof]);
      }
    }
  };

  const removeProof = (id: string) => {
    setProofs(proofs.filter(p => p.id !== id));
  };

  const handleSubmit = () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please upload an artwork image');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!medium) {
      Alert.alert('Error', 'Please select a medium');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be logged in');
      return;
    }

    // Show verification animation
    setShowVerification(true);
  };

  const handleVerificationComplete = () => {
    if (!user || !medium || !imageUri) return;

    addArtwork({
      title: title.trim(),
      description: description.trim(),
      artistId: user.id,
      artistName: user.name,
      artistAvatar: user.avatar,
      medium,
      tools: tools.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl: imageUri,
      thumbnailUrl: imageUri, // Using same image for thumbnail in this demo
      createdAt: new Date(),
      uploadedAt: new Date(),
      status: 'pending',
      processProofs: proofs,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      price: price ? parseFloat(price) : undefined,
    });

    setShowVerification(false);
    showSuccess('Success', 'Artwork submitted for verification');
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-secondary dark:bg-dark-primary" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 + insets.bottom }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">Upload Artwork</Text>
          <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            Submit your artwork for verification
          </Text>
        </View>

        {/* Upload Area */}
        <TouchableOpacity
          className="mb-6"
          onPress={() => pickImage('main')}
        >
          <Card variant="outlined" padding="none">
            {imageUri ? (
              <View className="relative">
                <RNImage
                  source={{ uri: imageUri }}
                  style={{ width: '100%', height: 250, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  resizeMode="cover"
                />
                <View className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-full flex-row items-center">
                  <Ionicons name="create-outline" size={16} color="#fff" />
                  <Text className="text-white text-xs ml-1 font-medium">Change</Text>
                </View>
              </View>
            ) : (
              <View className="items-center py-12 px-4">
                <View className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full items-center justify-center mb-4">
                  <Ionicons name="image" size={32} color="#059669" />
                </View>
                <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse">Upload Artwork Image</Text>
                <Text className="text-sm text-text-secondary dark:text-gray-400 mt-1 text-center">
                  Tap to choose from gallery
                </Text>
              </View>
            )}
          </Card>
        </TouchableOpacity>

        {/* Form */}
        <Input
          label="Title"
          placeholder="Enter artwork title"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          label="Description"
          placeholder="Describe your artwork and creative process"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        {/* Medium Selection */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-text-primary dark:text-text-inverse mb-2">Medium</Text>
          <View className="flex-row flex-wrap">
            {mediumOptions.map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => setMedium(option)}
                className={`
                  px-3 py-2 rounded-lg mr-2 mb-2
                  ${medium === option ? 'bg-primary-600' : 'bg-background-card dark:bg-dark-card border border-border-light dark:border-dark-tertiary'}
                `}
              >
                <Text
                  className={`text-sm ${medium === option ? 'text-white font-medium' : 'text-text-secondary dark:text-gray-400'}`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Tools Used"
          placeholder="e.g., Photoshop, Wacom, Oil paints"
          value={tools}
          onChangeText={setTools}
          helperText="Separate with commas"
        />

        <Input
          label="Tags"
          placeholder="e.g., landscape, abstract, portrait"
          value={tags}
          onChangeText={setTags}
          helperText="Separate with commas"
        />

        <Input
          label="Price (USD)"
          placeholder="0.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          helperText="Optional - leave blank if not for sale"
        />

        {/* Process Proofs */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-text-primary dark:text-text-inverse mb-2">Process Proofs</Text>
          <Text className="text-xs text-text-tertiary mb-3">
            Upload evidence of your creative process to increase verification success
          </Text>

          {/* Uploaded Proofs List */}
          {proofs.length > 0 && (
            <View className="mb-4">
              {proofs.map((proof) => (
                <View
                  key={proof.id}
                  className="flex-row items-center p-3 mb-2 bg-background-card dark:bg-dark-card rounded-lg border border-border-light dark:border-dark-tertiary"
                >
                  <RNImage
                    source={{ uri: proof.thumbnail }}
                    className="w-12 h-12 rounded bg-gray-200"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-sm font-medium text-text-primary dark:text-text-inverse">{proof.title}</Text>
                    <Text className="text-xs text-text-tertiary">{proof.fileName}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeProof(proof.id)}
                    className="p-2"
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add Proof Buttons */}
          <View className="flex-row flex-wrap">
            {([
              { icon: 'document-text', label: 'Sketches', type: 'sketch' },
              { icon: 'layers', label: 'PSD Layers', type: 'layer_structure' },
              { icon: 'videocam', label: 'Timelapse', type: 'timelapse' },
              { icon: 'images', label: 'WIP Photos', type: 'wip' },
            ] as const).map((proof, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] mb-3"
                onPress={() => pickImage('proof', proof.type)}
              >
                <Card variant="outlined" padding="sm">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-background-tertiary dark:bg-dark-tertiary rounded-lg items-center justify-center">
                      <Ionicons
                        name={proof.icon as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color="#64748b"
                      />
                    </View>
                    <Text className="text-sm text-text-secondary dark:text-gray-400 ml-2">{proof.label}</Text>
                    <Ionicons name="add" size={18} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <Button
          title="Submit for Verification"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onPress={handleSubmit}
        />
      </ScrollView>

      {/* Verification Animation Modal */}
      <VerificationAnimation
        visible={showVerification}
        onComplete={handleVerificationComplete}
        artworkTitle={title || 'Your Artwork'}
      />
    </SafeAreaView>
  );
}
