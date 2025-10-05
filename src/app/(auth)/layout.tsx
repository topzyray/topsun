"use client";

import "react-loading-skeleton/dist/skeleton.css";
import { ThemeToggle } from "@/components/atoms/mode-toggle";
import { RouteGuard } from "@/HOCs/guards/RouteGuard";
import SiteLogo from "@/components/atoms/site-logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard unprotected>
      <section className="bg-background min-h-screen">
        <div className="absolute top-4 right-2 sm:right-8 md:right-10 lg:right-60">
          <ThemeToggle />
        </div>
        <section className="px-3 sm:px-0">
          <Card className="mx-auto mt-24 flex max-w-sm justify-center rounded-lg">
            <CardHeader className="flex items-center justify-center">
              <SiteLogo />
            </CardHeader>
            <CardContent className="px-4">{children}</CardContent>
          </Card>
        </section>
      </section>
    </RouteGuard>
  );
}
