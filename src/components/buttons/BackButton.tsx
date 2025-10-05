"use client";

import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButton {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButton) {
  const router = useRouter();
  return (
    <Button
      variant="link"
      onClick={() => {
        onClick ? onClick() : router.back();
      }}
      className="pl-0 text-base"
    >
      <ArrowLeft /> Back
    </Button>
  );
}
