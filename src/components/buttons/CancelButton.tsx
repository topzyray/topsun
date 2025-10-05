"use client";

import React from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface CancelButton {
  onClose?: () => void;
  text?: string;
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
}

export default function CancelButton({ onClose, text = "Cancel", variant }: CancelButton) {
  return (
    <Button type="button" variant={`${variant ?? "destructive"}`} onClick={onClose}>
      {text ?? <X size={50} />}
    </Button>
  );
}
