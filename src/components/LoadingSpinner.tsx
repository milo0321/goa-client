interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }
  
  export default function LoadingSpinner({ 
    size = 'md', 
    className = '' 
  }: LoadingSpinnerProps) {
    const sizeClasses = {
      sm: 'h-5 w-5 border-2',
      md: 'h-8 w-8 border-3',
      lg: 'h-12 w-12 border-4'
    };
  
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div
          className={`animate-spin rounded-full border-solid border-t-transparent ${sizeClasses[size]} border-blue-600`}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  
  // 全屏加载版本
  export function FullPageLoadingSpinner() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }