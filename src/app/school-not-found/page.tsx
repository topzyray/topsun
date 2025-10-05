"use client";

import { Button } from "@/components/ui/button";
import { envConfig } from "@/configs/env.config";
import { useRouter } from "next/navigation";

export default function SchoolNotFoundPage() {
  const router = useRouter();
  const schoolEmail: string = envConfig.NEXT_PUBLIC_SCHOOL_DOMAIN;
  return (
    <div className="mt-24 flex h-screen w-full flex-col items-center gap-4 md:mt-32">
      <h2 className="text-xl font-bold uppercase md:text-3xl">School Not Found</h2>
      <p className="text-sm md:text-lg">Could not find requested resource</p>
      <p className="text-sm md:text-lg">Contact Support: {`${schoolEmail}`}</p>
      <Button onClick={() => router.push(`/`)}>Go back</Button>
    </div>
  );
}
