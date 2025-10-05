import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      //   className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold text-white"
      className="hover:ring-primary w-full max-w-sm cursor-pointer rounded-2xl p-6 text-center shadow-md transition-all duration-300 ease-in-out hover:ring-1"
    >
      <div className="mb-4 flex items-center justify-center">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </motion.div>
  );
}
