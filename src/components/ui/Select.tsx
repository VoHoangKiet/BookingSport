import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  className?: string;
}

export function Select({ 
  label, 
  error, 
  options, 
  placeholder = 'Chọn...', 
  value,
  onChange,
  className 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [prevValue, setPrevValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (value !== prevValue) {
    setSelectedValue(value || '');
    setPrevValue(value);
  }

  const selectedOption = options.find(opt => String(opt.value) === String(selectedValue));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    const newValue = String(optionValue);
    setSelectedValue(newValue);
    setIsOpen(false);
    onChange?.(newValue);
  };

  return (
    <div className={cn('w-full', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative w-full px-4 py-3 text-left bg-white rounded-xl border-2 transition-all duration-200',
          'hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
          'flex items-center justify-between gap-2',
          isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200',
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
        )}
      >
        <span className={cn(
          'block truncate',
          selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'
        )}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon && <span>{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : placeholder}
        </span>
        
        {/* Arrow icon with rotation animation */}
        <svg 
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto py-1">
            {/* Empty option */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className={cn(
                'w-full px-4 py-3 text-left transition-colors flex items-center gap-3',
                'hover:bg-emerald-50 hover:text-emerald-700',
                !selectedValue && 'bg-emerald-50 text-emerald-700'
              )}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {!selectedValue && (
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className="text-gray-400 italic">{placeholder}</span>
            </button>

            {/* Options */}
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full px-4 py-3 text-left transition-colors flex items-center gap-3',
                  'hover:bg-emerald-50 hover:text-emerald-700',
                  String(selectedValue) === String(option.value) && 'bg-emerald-50 text-emerald-700 font-medium'
                )}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {String(selectedValue) === String(option.value) && (
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                {option.icon && <span className="text-lg">{option.icon}</span>}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
