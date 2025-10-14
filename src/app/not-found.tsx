"use client";

import Navbar from "@/components/pages/home/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div>
      <Navbar />
      <div className="flex h-screen w-full flex-col items-center gap-4 bg-gradient-to-tr from-slate-50 to-blue-50 pt-24 md:pt-32 dark:from-slate-900 dark:to-slate-800">
        <h2 className="text-xl font-bold uppercase md:text-3xl">Not Found</h2>
        <p className="text-sm md:text-lg">Could not find requested resource</p>
        <Button onClick={() => router.back()}>Go back</Button>
      </div>
    </div>
  );
}
