import React from 'react';
import { View, Text, ViewProps } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-background-tertiary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-primary-100',
  outline: 'bg-transparent border border-border-medium',
};

const variantTextClasses: Record<BadgeVariant, string> = {
  default: 'text-text-primary',
  success: 'text-white',
  warning: 'text-white',
  error: 'text-white',
  info: 'text-primary-700',
  outline: 'text-text-secondary',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-1',
  lg: 'px-3 py-1.5',
};

const textSizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  icon,
  style,
  ...props
}: BadgeProps) {
  return (
    <View
      className={`
        flex-row items-center rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
      style={style}
      {...props}
    >
      {icon && <View className="mr-1">{icon}</View>}
      <Text
        className={`
          font-medium
          ${variantTextClasses[variant]}
          ${textSizeClasses[size]}
        `}
      >
        {label}
      </Text>
    </View>
  );
}

// Status Badge for verification status
interface StatusBadgeProps {
  status: 'pending' | 'in_review' | 'verified' | 'flagged' | 'rejected';
  size?: BadgeSize;
}

const statusConfig: Record<StatusBadgeProps['status'], { label: string; variant: BadgeVariant }> = {
  pending: { label: 'Pending', variant: 'default' },
  in_review: { label: 'In Review', variant: 'info' },
  verified: { label: 'Verified', variant: 'success' },
  flagged: { label: 'Flagged', variant: 'warning' },
  rejected: { label: 'Rejected', variant: 'error' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge label={config.label} variant={config.variant} size={size} />;
}
