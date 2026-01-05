import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg
      className={cn('animate-spin text-emerald-600', sizes[size], className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 z-50">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main content */}
      <div className="relative text-center">
        {/* Logo with bounce animation */}
        <div className="mb-8 animate-bounce">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl shadow-2xl shadow-emerald-500/30 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
            <Home className="w-12 h-12 text-white transform -rotate-12" />
          </div>
        </div>

        {/* Brand name with fade-in */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-fade-in">
          BookingSport
        </h1>

        {/* Loading dots animation */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce-delay-0" />
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce-delay-150" />
          <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce-delay-300" />
        </div>

        {/* Loading text with shimmer effect */}
        <div className="relative overflow-hidden">
          <p className="text-gray-500 font-medium">Đang tải...</p>
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-48 h-1.5 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}

// Page loading skeleton with animation
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-10 w-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-shimmer-bg" />
          <div className="h-4 w-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer-bg delay-100" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer-bg" />
              <div className="p-6 space-y-3">
                <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer-bg" />
                <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer-bg delay-150" />
                <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer-bg delay-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
