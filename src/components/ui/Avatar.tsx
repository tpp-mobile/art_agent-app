import React from 'react';
import { View, Text, Image, ImageProps } from 'react-native';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: AvatarSize;
  showBorder?: boolean;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const textSizeClasses: Record<AvatarSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const getInitials = (name: string): string => {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0]?.substring(0, 2).toUpperCase() || '??';
};

export function Avatar({
  source,
  name = 'User',
  size = 'md',
  showBorder = false,
}: AvatarProps) {
  const borderClass = showBorder ? 'border-2 border-primary-500' : '';

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        className={`
          rounded-full
          ${sizeClasses[size]}
          ${borderClass}
        `}
        resizeMode="cover"
      />
    );
  }

  // Fallback to initials
  return (
    <View
      className={`
        rounded-full bg-primary-100 items-center justify-center
        ${sizeClasses[size]}
        ${borderClass}
      `}
    >
      <Text className={`font-semibold text-primary-700 ${textSizeClasses[size]}`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
