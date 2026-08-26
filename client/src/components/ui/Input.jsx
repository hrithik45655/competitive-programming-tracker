import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#09090b] px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 dark:focus:ring-white/30 dark:focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-gray-100 transition-colors shadow-sm",
          error && "border-red-500 focus:ring-red-500 dark:border-red-500/50 dark:focus:ring-red-500/50",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
