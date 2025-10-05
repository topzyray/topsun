interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function GradientBackground({ children, className = "" }: GradientBackgroundProps) {
  return (
    <div
      className={`dark:via-sidebar dark:to-sidebar relative flex items-center justify-center bg-gradient-to-br from-white via-[#eafff5] to-white text-white transition-colors duration-500 ease-in-out dark:from-gray-700 ${className} `}
    >
      {children}
    </div>
  );
}
