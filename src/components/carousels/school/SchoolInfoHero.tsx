"use client";

import Image from "next/image";
import LogoPlaceholder from "../../../../public/images/placeholder.png";
import { FileUploader } from "@/components/uploader/FileUploader";
import { SchoolApiService } from "@/api/services/SchoolApiService";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { TextHelper } from "@/helpers/TextHelper";
import { TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface SchoolData {
  schoolDetails: any;
}

export default function SchoolInfoHero({ schoolDetails }: SchoolData) {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
  const { userDetails } = useAuth();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-sidebar flex justify-between p-4">
        <div>
          <p className="font-semibold capitalize sm:text-lg lg:text-2xl">
            <span>Welcome back, {userDetails?.first_name}! </span>
            <span className="animate-pulse">👋</span>
          </p>
          <p className="text-sm">{`${TextHelper.getFormattedDate(Date())}`}</p>
        </div>
        <div>
          <Button size="sm" className="rounded-2xl md:text-base">
            <TimerIcon />
            <span>{time}</span>
          </Button>
        </div>
      </Card>
      <div className="relative h-[55vh] md:h-[65vh]">
        <div
          className="flex h-full items-center justify-center rounded-lg bg-cover bg-center py-10 md:py-20"
          style={{
            backgroundImage: `url(${
              schoolDetails?.school_image?.url ?? "/images/placeholder-pattern.jpg"
            })`,
          }}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="relative">
              <div className="border-secondary h-24 w-24 rounded border-2 lg:h-32 lg:w-32">
                <Image
                  src={schoolDetails?.logo?.url ?? LogoPlaceholder}
                  alt={`${schoolDetails?.school_name} logo`}
                  width={80}
                  height={80}
                  className="h-full w-full rounded shadow-lg"
                />
              </div>
              {userDetails && userDetails.role === "super_admin" && (
                <FileUploader
                  uploadFn={SchoolApiService.uploadSchoolLogo}
                  extraParams={{ school_id: schoolDetails?._id }}
                  formName="logo"
                  // onUploadSuccess={(data) => {
                  //   StorageUtilsHelper.saveToLocalStorage([STORE_KEYS.SCHOOL_DETAILS, data.school]);
                  // }}
                />
              )}
            </div>
            <h2 className="text-shadow text-center text-4xl font-extrabold text-white capitalize md:text-6xl">
              {schoolDetails?.school_name}
            </h2>
          </div>
        </div>
        {userDetails && userDetails.role === "super_admin" && (
          <FileUploader
            uploadFn={SchoolApiService.uploadSchoolImage}
            extraParams={{ school_id: schoolDetails?._id }}
            formName="school_image"
            // onUploadSuccess={(data) => {
            //   StorageUtilsHelper.saveToLocalStorage([STORE_KEYS.SCHOOL_DETAILS, data.school]);
            // }}
          />
        )}
      </div>
    </div>
  );
}
