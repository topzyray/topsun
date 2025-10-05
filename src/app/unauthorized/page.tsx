"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/images/logo.png";
import { ThemeToggle } from "@/components/atoms/mode-toggle";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/providers/global-state-provider";
import { ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const { userDetails } = useAuth();
  const { setShowNavModal } = useContext(GlobalContext);
  const router = useRouter();
  return (
    <section className="flex h-screen items-center">
      <div className="absolute top-2 right-2">
        <ThemeToggle />
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-8 max-w-md px-4 sm:px-6 lg:px-8">
          <div className="shadow-muted shadow">
            <div className="flex flex-col items-center justify-center gap-5 px-4 py-6 sm:px-8 sm:py-10">
              <div className="space-y-2 text-center text-lg text-red-700 md:text-xl">
                <span className="flex justify-center">
                  <Link onClick={() => setShowNavModal(false)} href="/">
                    <Image
                      src={Logo}
                      alt="Logo"
                      className="h-7 w-8 hover:drop-shadow-[0px_1.2px_1.2px_rgba(0,0,0,0.8)] lg:h-10 lg:w-10"
                    />
                  </Link>
                </span>
                <p>You are not authorized to view the page requested.</p>
                <span
                  onClick={() => router.push(`/dashboard/${userDetails?.role}/overview`)}
                  className="flex cursor-pointer items-center justify-center gap-1 font-bold hover:underline"
                >
                  <ArrowLeft />
                  <span>Go back</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
