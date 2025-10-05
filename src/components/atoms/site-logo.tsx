import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import DefaultLogo from "../../../public/images/logo.png";
import { envConfig } from "@/configs/env.config";
import { cn } from "@/lib/utils";

interface ISiteLogo {
  logo?: StaticImageData;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function SiteLogo({ logo, className, disabled, onClick }: ISiteLogo) {
  return (
    <>
      {disabled ? (
        <div className={cn(`h-14 w-14`, className)}>
          <Image
            src={logo ?? DefaultLogo}
            alt={`${envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL} Logo`}
            className="h-full w-full"
          />
        </div>
      ) : (
        <div onClick={onClick} className={cn(`h-14 w-14`, className)}>
          <Link href="/">
            <Image
              src={logo ?? DefaultLogo}
              alt={`${envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL} Logo`}
              className="h-full w-full"
            />
          </Link>
        </div>
      )}
    </>
  );
}
