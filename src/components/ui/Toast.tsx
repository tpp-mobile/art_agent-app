import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotificationStore } from '../../stores';
import { Toast as ToastType, ToastType as ToastVariant } from '../../types';

const { width } = Dimensions.get('window');

const toastConfig: Record<
  ToastVariant,
  { icon: keyof typeof Ionicons.glyphMap; bgColor: string; iconColor: string }
> = {
  success: {
    icon: 'checkmark-circle',
    bgColor: 'bg-primary-600',
    iconColor: '#ffffff',
  },
  error: {
    icon: 'close-circle',
    bgColor: 'bg-error',
    iconColor: '#ffffff',
  },
  warning: {
    icon: 'warning',
    bgColor: 'bg-warning',
    iconColor: '#ffffff',
  },
  info: {
    icon: 'information-circle',
    bgColor: 'bg-info',
    iconColor: '#ffffff',
  },
};

interface ToastItemProps {
  toast: ToastType;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = toastConfig[toast.type];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        width: width - 32,
      }}
      className={`
        flex-row items-center
        ${config.bgColor}
        rounded-xl px-4 py-3 mb-2
        shadow-lg
      `}
    >
      <Ionicons name={config.icon} size={24} color={config.iconColor} />
      <View className="flex-1 ml-3">
        <Text className="text-white font-semibold">{toast.title}</Text>
        {toast.message && (
          <Text className="text-white/80 text-sm mt-0.5">{toast.message}</Text>
        )}
      </View>
      <TouchableOpacity onPress={handleDismiss} className="p-1">
        <Ionicons name="close" size={20} color="#ffffff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastContainer() {
  const insets = useSafeAreaInsets();
  const { toasts, dismissToast } = useNotificationStore();

  if (toasts.length === 0) return null;

  return (
    <View
      className="absolute left-4 right-4 items-center z-50"
      style={{ top: insets.top + 10 }}
      pointerEvents="box-none"
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </View>
  );
}
