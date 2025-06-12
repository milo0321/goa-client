import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/utils';

type Variant = 'default' | 'success' | 'danger' | 'info';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  success: 'bg-green-100 text-green-800 hover:bg-green-200',
  danger: 'bg-red-100 text-red-800 hover:bg-red-200',
  info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
};

export function ActionButton({
  variant = 'default',
  children,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
