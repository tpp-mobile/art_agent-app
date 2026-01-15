import React from 'react';
import { View, Text } from 'react-native';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

const iconBgColors = {
  default: 'bg-background-tertiary dark:bg-dark-tertiary',
  primary: 'bg-primary-100 dark:bg-primary-900/30',
  success: 'bg-green-100 dark:bg-green-900/30',
  warning: 'bg-amber-100 dark:bg-amber-900/30',
  error: 'bg-red-100 dark:bg-red-900/30',
};

const iconColors = {
  default: 'text-text-secondary',
  primary: 'text-primary-600',
  success: 'text-green-600',
  warning: 'text-amber-600',
  error: 'text-red-600',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'default',
}: StatCardProps) {
  return (
    <Card variant="elevated" padding="md">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-sm text-text-secondary dark:text-gray-400 mb-1">{title}</Text>
          <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse">{value}</Text>

          {trend && (
            <View className="flex-row items-center mt-1">
              <Text
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success' : 'text-error'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Text>
              {subtitle && (
                <Text className="text-sm text-text-tertiary ml-1">
                  {subtitle}
                </Text>
              )}
            </View>
          )}

          {!trend && subtitle && (
            <Text className="text-sm text-text-tertiary mt-1">{subtitle}</Text>
          )}
        </View>

        {icon && (
          <View
            className={`
              w-10 h-10 rounded-lg items-center justify-center
              ${iconBgColors[color]}
            `}
          >
            {icon}
          </View>
        )}
      </View>
    </Card>
  );
}
