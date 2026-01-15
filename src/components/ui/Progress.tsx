import React from 'react';
import { View, Text } from 'react-native';

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
};

export function Progress({
  value,
  max = 100,
  showLabel = false,
  label,
  size = 'md',
  color = 'primary',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <View>
      {(showLabel || label) && (
        <View className="flex-row justify-between mb-1">
          {label && (
            <Text className="text-sm text-text-secondary">{label}</Text>
          )}
          {showLabel && (
            <Text className="text-sm font-medium text-text-primary">
              {Math.round(percentage)}%
            </Text>
          )}
        </View>
      )}
      <View className={`w-full bg-background-tertiary rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <View
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}

// Circular Progress
interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'success' | 'warning' | 'error';
  showValue?: boolean;
}

export function CircularProgress({
  value,
  size = 60,
  strokeWidth = 6,
  color = 'primary',
  showValue = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorValues = {
    primary: '#10b981',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <View
        className="absolute w-full h-full rounded-full border-4 border-background-tertiary"
        style={{ borderWidth: strokeWidth }}
      />
      <View
        className="absolute w-full h-full"
        style={{
          transform: [{ rotate: '-90deg' }],
        }}
      >
        {/* This would need react-native-svg for proper implementation */}
        {/* For now, we'll show the value */}
      </View>
      {showValue && (
        <Text className="text-lg font-bold text-text-primary">
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
}
