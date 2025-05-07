import { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface GenericModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  isLoading?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export function GenericModal({
  isOpen,
  title,
  onClose,
  children,
  isLoading = false,
  ref
}: GenericModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
      ref={ref}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <LoadingSpinner size="md" />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}