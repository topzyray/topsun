"use client";

import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import ComponentLevelLoader from "../loaders/component-level-loader";

interface SubmitButton {
  onSubmit?: () => void;
  disabled?: boolean;
  loading: boolean;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "success"
    | null
    | undefined;
  text?: ReactNode;
  type?: "button" | "submit";
  className?: string;
}

export default function SubmitButton({
  onSubmit,
  disabled,
  loading,
  size,
  variant,
  text,
  type,
  className,
}: SubmitButton) {
  return (
    <Button
      size={size}
      variant={variant}
      type={type ?? "submit"}
      disabled={disabled}
      onClick={onSubmit}
      className={className}
    >
      {loading ? <ComponentLevelLoader loading={loading} /> : (text ?? "Submit")}
    </Button>
  );
}
