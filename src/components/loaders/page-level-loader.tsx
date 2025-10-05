"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

type PageLevelLoaderProp = {
  loading: boolean;
  size?: number;
  className?: string;
  text?: string;
  lightColor?: string;
  darkColor?: string;
};

export function BlockLoader({ className }: PageLevelLoaderProp) {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") as string);
  }, [theme]);

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 capitalize lg:text-lg ${className}`}
    >
      {/* <PulseLoader
        // color={theme == "light" ? "#01011E" : "#FFFFFF"}
        color={
          theme != "light"
            ? `${darkColor || "#FFFFFF"}`
            : `${lightColor || "#000000"}`
        }
        loading={loading}
        size={size ? size : 8}
        data-testid="loader"
      />
      {text ?? "Loading"} */}
      <Skeleton className="h-28 w-full rounded-md" />
    </div>
  );
}

export function CircularLoader({
  text,
  textClassName,
  rollerClassName,
  parentClassName,
  ...props
}: {
  text: string;
  textClassName?: string;
  rollerClassName?: string;
  parentClassName?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={cn("text-center", parentClassName)}
      {...props}
    >
      <div
        className={cn(
          "border-primary mx-auto h-12 w-12 animate-spin rounded-full border-8 border-dashed",
          rollerClassName,
        )}
        {...props}
      ></div>
      <p
        className={cn("mt-4 text-base font-semibold lg:text-xl lg:font-semibold", textClassName)}
        {...props}
      >
        {text}
      </p>
    </motion.div>
  );
}

export function TextLoader({ className, text }: { className?: string; text: string }) {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") as string);
  }, [theme]);

  return (
    <Card className="w-full rounded bg-transparent p-4 text-center">
      <CardContent>
        <p className={`animate-pulse text-sm capitalize ${className}`}>{text}</p>
      </CardContent>
    </Card>
  );
}
