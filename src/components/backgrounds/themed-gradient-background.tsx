interface ThemedGradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function ThemedGradientBackground({
  children,
  className = "",
}: ThemedGradientBackgroundProps) {
  return (
    <div
      className={`animate-gradient-x flex h-screen items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 bg-[length:200%_200%] text-white transition-colors duration-500 ease-in-out dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 ${className} `}
    >
      {children}
    </div>
  );
}

export default ThemedGradientBackground;
