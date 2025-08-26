import * as React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  onClick?: () => void;
  className?: string;
  fontSize?: number;
  buttonColor?: 'blue' | 'red' | 'green';
  buttonType?: 'filled' | 'outline';
  children?: React.ReactNode;
}

export default function ActionButton({
  onClick,
  className,
  fontSize = 20,
  buttonColor = 'blue',
  buttonType = 'filled',
  children,
  ...props
}: ActionButtonProps &
  Omit<
    React.ComponentProps<typeof Button>,
    'children' | 'asChild' | 'onClick'
  >) {
  const getMainColors = (): string => {
    switch (buttonColor) {
      case 'blue':
        return 'button-action';
      case 'red':
        return 'button-cancel';
      case 'green':
        return 'button-upload';
      default:
        return '';
    }
  };

  const getSubColors = (): string => {
    switch (buttonColor) {
      default:
        return 'white';
    }
  };

  const getDefaultStyles = (): string => {
    const mainColor = getMainColors();
    const subColor = getSubColors();

    switch (buttonType) {
      case 'filled':
        return `text-${subColor} bg-${mainColor} border-${mainColor}`;
      case 'outline':
        return `text-${mainColor} bg-${subColor} border-${mainColor}`;
      default:
        return '';
    }
  };

  const buttonStyle = getDefaultStyles();

  return (
    <Button
      className={cn(
        `inline-flex rounded-full px-6 py-2 h-10 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`,
        buttonStyle,
        className,
      )}
      onClick={onClick}
      style={{ fontSize, minWidth: 100 }}
      {...props}
    >
      {children}
    </Button>
  );
}
