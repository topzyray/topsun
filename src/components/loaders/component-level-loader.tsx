"use client";

import { useTheme } from "next-themes";
import { PulseLoader } from "react-spinners";

type ComponentLevelLoaderProps = {
  text?: string;
  // color?: string;
  lightColor?: string;
  darkColor?: string;
  loading: boolean;
  size?: number;
};

export default function ComponentLevelLoader({
  text,
  loading,
  size,
  lightColor,
  darkColor,
}: ComponentLevelLoaderProps) {
  const { theme } = useTheme();

  return (
    <span className="flex items-center justify-center gap-1">
      {text ?? "Processing"}
      <PulseLoader
        color={theme != "light" ? `${darkColor || "#01011E"}` : `${lightColor || "#FFFFFF"}`}
        loading={loading}
        size={size || 10}
        data-testid="loader"
      />
    </span>
  );
}
