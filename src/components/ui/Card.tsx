import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses = {
  default: 'bg-background-card dark:bg-dark-card',
  elevated: 'bg-background-card dark:bg-dark-card shadow-lg',
  outlined: 'bg-background-card dark:bg-dark-card border border-border-light dark:border-dark-tertiary',
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  style,
  ...props
}: CardProps) {
  return (
    <View
      className={`
        rounded-xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${className}
      `}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

// Card Header
interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <View className={`mb-4 ${className}`} {...props}>
      {children}
    </View>
  );
}

// Card Content
interface CardContentProps extends ViewProps {
  children: React.ReactNode;
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <View className={className} {...props}>
      {children}
    </View>
  );
}

// Card Footer
interface CardFooterProps extends ViewProps {
  children: React.ReactNode;
}

export function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <View className={`mt-4 pt-4 border-t border-border-light dark:border-dark-tertiary ${className}`} {...props}>
      {children}
    </View>
  );
}
