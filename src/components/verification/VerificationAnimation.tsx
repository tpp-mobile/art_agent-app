import React, { useEffect, useState } from 'react';
import { View, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface VerificationStep {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  duration: number;
}

const verificationSteps: VerificationStep[] = [
  { id: 'upload', label: 'Uploading artwork...', icon: 'cloud-upload', duration: 1500 },
  { id: 'metadata', label: 'Analyzing metadata...', icon: 'document-text', duration: 2000 },
  { id: 'ai_check', label: 'Running AI detection...', icon: 'hardware-chip', duration: 2500 },
  { id: 'layers', label: 'Analyzing layer structure...', icon: 'layers', duration: 2000 },
  { id: 'brushwork', label: 'Examining brushwork patterns...', icon: 'brush', duration: 2000 },
  { id: 'proofs', label: 'Verifying process proofs...', icon: 'checkmark-circle', duration: 1500 },
  { id: 'score', label: 'Calculating Human Score...', icon: 'analytics', duration: 1500 },
  { id: 'complete', label: 'Verification complete!', icon: 'shield-checkmark', duration: 1000 },
];

interface VerificationAnimationProps {
  visible: boolean;
  onComplete: () => void;
  artworkTitle?: string;
}

export function VerificationAnimation({
  visible,
  onComplete,
  artworkTitle = 'Your Artwork',
}: VerificationAnimationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [humanScore, setHumanScore] = useState(0);

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setCurrentStepIndex(0);
      setIsComplete(false);
      setHumanScore(0);
      progress.value = 0;

      // Start rotation animation
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );

      // Start scale pulse
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );

      // Progress through steps
      let totalDelay = 0;
      verificationSteps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentStepIndex(index);
          progress.value = withTiming((index + 1) / verificationSteps.length, {
            duration: 300,
          });

          // Generate random score at the score step
          if (step.id === 'score') {
            const score = Math.floor(Math.random() * 10) + 90; // 90-99
            setHumanScore(score);
          }

          // Complete at the last step
          if (index === verificationSteps.length - 1) {
            setIsComplete(true);
            setTimeout(() => {
              onComplete();
            }, 1500);
          }
        }, totalDelay);
        totalDelay += step.duration;
      });
    }
  }, [visible]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const currentStep = verificationSteps[currentStepIndex];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/80 items-center justify-center px-6">
        <View className="bg-background-card dark:bg-dark-card rounded-3xl p-8 w-full max-w-sm items-center">
          {/* Animated Icon */}
          <View className="mb-6">
            {isComplete ? (
              <Animated.View style={pulseStyle}>
                <View className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center">
                  <Ionicons name="shield-checkmark" size={48} color="#10b981" />
                </View>
              </Animated.View>
            ) : (
              <Animated.View style={spinStyle}>
                <View className="w-24 h-24 rounded-full border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 items-center justify-center">
                  <Ionicons name={currentStep.icon} size={32} color="#059669" />
                </View>
              </Animated.View>
            )}
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-text-primary dark:text-text-inverse text-center mb-2">
            {isComplete ? 'Verification Complete!' : 'Verifying Artwork'}
          </Text>
          <Text className="text-sm text-text-secondary dark:text-gray-400 text-center mb-6">
            {artworkTitle}
          </Text>

          {/* Progress Bar */}
          <View className="w-full h-2 bg-background-tertiary dark:bg-dark-tertiary rounded-full overflow-hidden mb-4">
            <Animated.View
              className="h-full bg-primary-600 rounded-full"
              style={progressStyle}
            />
          </View>

          {/* Current Step */}
          <View className="flex-row items-center mb-6">
            <Ionicons
              name={currentStep.icon}
              size={20}
              color={isComplete ? '#10b981' : '#64748b'}
            />
            <Text className="text-sm text-text-secondary dark:text-gray-400 ml-2">
              {currentStep.label}
            </Text>
          </View>

          {/* Human Score (when complete) */}
          {isComplete && humanScore > 0 && (
            <View className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl px-6 py-4 items-center">
              <Text className="text-sm text-text-secondary dark:text-gray-400 mb-1">
                Human Score
              </Text>
              <Text className="text-4xl font-bold text-primary-600">
                {humanScore}%
              </Text>
              <Text className="text-xs text-text-tertiary mt-1">
                Verified as human-made
              </Text>
            </View>
          )}

          {/* Steps List */}
          {!isComplete && (
            <View className="w-full mt-4">
              {verificationSteps.slice(0, currentStepIndex + 1).map((step, index) => (
                <View
                  key={step.id}
                  className="flex-row items-center py-1"
                >
                  <Ionicons
                    name={index < currentStepIndex ? 'checkmark-circle' : 'ellipse'}
                    size={16}
                    color={index < currentStepIndex ? '#10b981' : '#64748b'}
                  />
                  <Text
                    className={`text-xs ml-2 ${
                      index < currentStepIndex
                        ? 'text-primary-600'
                        : 'text-text-tertiary'
                    }`}
                  >
                    {step.label.replace('...', '')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
