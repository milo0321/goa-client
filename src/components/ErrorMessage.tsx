import { IconX } from '@tabler/icons-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  variant?: 'default' | 'danger' | 'warning';
  className?: string;
}

export default function ErrorMessage({
  message,
  onClose,
  variant = 'danger',
  className = ''
}: ErrorMessageProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    danger: 'bg-red-50 text-red-800',
    warning: 'bg-yellow-50 text-yellow-800'
  };

  return (
    <div
      className={`rounded-md p-4 ${variantClasses[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <IconX className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onClose}
              className={`-mx-1.5 -my-1.5 inline-flex rounded-md p-1.5 focus:outline-none ${
                variant === 'danger' 
                  ? 'hover:bg-red-100 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50' 
                  : variant === 'warning'
                  ? 'hover:bg-yellow-100 focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50'
                  : 'hover:bg-gray-100 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-50'
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <IconX className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 全屏错误消息版本
export function FullPageError({
  message,
  onRetry,
  retryText = 'Retry'
}: {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center max-w-md p-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <IconX className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Error</h3>
        <div className="mt-2 text-sm text-gray-600">
          <p>{message}</p>
        </div>
        {onRetry && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {retryText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}