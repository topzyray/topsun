interface AnimatedGradientProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedGradientBackground({
  children,
  className = "",
}: AnimatedGradientProps) {
  return (
    <div
      className={`animate-gradient-x flex h-screen items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-[length:200%_200%] text-white transition-colors duration-500 ease-in-out dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 ${className} `}
    >
      {children}
    </div>
  );
}
