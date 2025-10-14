"use client";

import Navbar from "@/components/pages/home/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <div>
      <Navbar />
      <div className="flex h-screen w-full flex-col items-center gap-4 bg-gradient-to-tr from-slate-50 to-blue-50 pt-24 md:pt-32 dark:from-slate-900 dark:to-slate-800">
        <h2 className="text-xl font-bold text-red-600 uppercase md:text-3xl">An Error Occurred</h2>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    </div>
  );
}
