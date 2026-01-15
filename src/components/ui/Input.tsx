import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? 'border-error'
    : isFocused
    ? 'border-primary-500'
    : 'border-border-medium';

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-text-primary dark:text-text-inverse mb-1.5">
          {label}
        </Text>
      )}

      <View
        className={`
          flex-row items-center
          bg-background-primary dark:bg-dark-secondary
          border rounded-lg
          ${borderColor}
          px-3
        `}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        <TextInput
          className="flex-1 py-3 text-base text-text-primary dark:text-text-inverse"
          placeholderTextColor="#94a3b8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          style={style}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-1"
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#94a3b8"
            />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && <View className="ml-2">{rightIcon}</View>}
      </View>

      {error && (
        <Text className="text-sm text-error mt-1">{error}</Text>
      )}

      {helperText && !error && (
        <Text className="text-sm text-text-tertiary mt-1">{helperText}</Text>
      )}
    </View>
  );
}

// Search Input
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export function SearchInput({ value, onClear, ...props }: SearchInputProps) {
  return (
    <Input
      leftIcon={<Ionicons name="search" size={20} color="#94a3b8" />}
      rightIcon={
        value ? (
          <TouchableOpacity onPress={onClear}>
            <Ionicons name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        ) : undefined
      }
      value={value}
      {...props}
    />
  );
}
