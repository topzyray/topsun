"use client";

import { useState } from "react";
import Link from "next/link";

export default function EnrollSchoolGoogleForm() {
  const [loadingGoogleForm, setLoadingGoogleForm] = useState(true);
  return (
    <div className="h-screen w-full px-4 md:px-6">
      <div className="mx-auto h-full w-full max-w-4xl">
        <div className="mb-4">
          <p>
            If the form below is not loading, please click{" "}
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdmrS6pmsgRm7pHJz324zAEIXwLCsgOxvCgSBNLcTyE_oSCaA/viewform?embedded=true"
              target="_blank"
              className="text-lightergreen hover:underline"
            >
              Schedule A Call
            </Link>{" "}
            to access the form.
          </p>
        </div>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdmrS6pmsgRm7pHJz324zAEIXwLCsgOxvCgSBNLcTyE_oSCaA/viewform?embedded=true"
          width="100%"
          height="100%"
          className="h-full w-full rounded-lg"
          onLoad={() => {
            console.log("Iframe loaded");
            setTimeout(() => setLoadingGoogleForm(false), 1000);
          }}
          loading="eager"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}
