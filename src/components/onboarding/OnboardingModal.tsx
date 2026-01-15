import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useOnboardingStore, onboardingSteps } from '../../stores/onboardingStore';
import { Button } from '../ui';
import { UserRole } from '../../types';

interface OnboardingModalProps {
  visible: boolean;
  role: UserRole;
  onComplete: () => void;
}

export function OnboardingModal({ visible, role, onComplete }: OnboardingModalProps) {
  const { currentStep, setCurrentStep, nextStep, prevStep, setHasSeenOnboarding } = useOnboardingStore();
  const steps = onboardingSteps[role];
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      nextStep();
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      prevStep();
    }
  };

  const handleComplete = () => {
    setHasSeenOnboarding(role);
    setCurrentStep(0);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentStepData = steps[currentStep];

  const getRoleColor = () => {
    switch (role) {
      case 'artist':
        return '#10b981'; // primary/green
      case 'agent':
        return '#3b82f6'; // blue
      default:
        return '#10b981';
    }
  };

  const roleColor = getRoleColor();

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/60">
        <SafeAreaView className="flex-1 justify-center items-center px-6">
          <View className="bg-background-card dark:bg-dark-card rounded-3xl w-full max-w-sm overflow-hidden">
            {/* Skip Button */}
            <TouchableOpacity
              onPress={handleSkip}
              className="absolute top-4 right-4 z-10"
            >
              <Text className="text-sm text-text-tertiary">Skip</Text>
            </TouchableOpacity>

            {/* Content */}
            <View className="items-center px-6 pt-12 pb-6">
              {/* Icon */}
              <View
                className="w-24 h-24 rounded-full items-center justify-center mb-6"
                style={{ backgroundColor: `${roleColor}20` }}
              >
                <Ionicons
                  name={currentStepData.icon as keyof typeof Ionicons.glyphMap}
                  size={48}
                  color={roleColor}
                />
              </View>

              {/* Title */}
              <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse text-center mb-3">
                {currentStepData.title}
              </Text>

              {/* Description */}
              <Text className="text-base text-text-secondary dark:text-gray-400 text-center leading-6">
                {currentStepData.description}
              </Text>
            </View>

            {/* Progress Dots */}
            <View className="flex-row justify-center py-4">
              {steps.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${index === currentStep
                    ? 'w-6'
                    : ''
                    }`}
                  style={{
                    backgroundColor: index === currentStep ? roleColor : '#e2e8f0',
                  }}
                />
              ))}
            </View>

            {/* Navigation Buttons */}
            <View className="flex-row px-6 pb-6">
              {currentStep > 0 ? (
                <TouchableOpacity
                  onPress={handlePrev}
                  className="w-12 h-12 rounded-full bg-background-tertiary dark:bg-dark-tertiary items-center justify-center mr-3"
                >
                  <Ionicons name="arrow-back" size={24} color="#64748b" />
                </TouchableOpacity>
              ) : (
                <View className="w-12" />
              )}

              <TouchableOpacity
                onPress={handleNext}
                className="flex-1 h-12 rounded-full items-center justify-center flex-row"
                style={{ backgroundColor: roleColor }}
              >
                <Text className="text-white font-semibold text-base mr-2">
                  {currentStep === totalSteps - 1 ? 'Get Started' : 'Next'}
                </Text>
                <Ionicons
                  name={currentStep === totalSteps - 1 ? 'checkmark' : 'arrow-forward'}
                  size={20}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>

            {/* Step Counter */}
            <View className="pb-4">
              <Text className="text-xs text-text-tertiary text-center">
                {currentStep + 1} of {totalSteps}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
