"use client";

import React from "react";
import { MapPin, Phone, Mail, Globe, GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { envConfig } from "@/configs/env.config";
import Link from "next/link";

export default function ContactAndFooter() {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <footer id="contact" className="bg-muted text-muted-foreground py-16 transition-colors">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center space-x-3">
              <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-lg">
                <GraduationCap className="text-accent-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="text-foreground text-xl font-bold">
                  {envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {envConfig.NEXT_PUBLIC_SCHOOL_MOTTO}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              Inspiring young minds to achieve their full potential through innovative education,
              strong values, and exceptional care.
            </p>
          </div>

          <div>
            <h4 className="text-foreground mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Academic Programs
                </Link>
              </li>
              <li>
                <Link
                  href="/#admissions"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admissions
                </Link>
              </li>
              <li>
                <Link
                  href="/#news"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  News & Events
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Virtual Tour
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground mb-4 font-semibold">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="text-accent h-4 w-4" />
                <span className="text-muted-foreground">
                  {envConfig.NEXT_PUBLIC_SCHOOL_ADDRESS}
                  <br />
                  {envConfig.NEXT_PUBLIC_SCHOOL_CITY}, {envConfig.NEXT_PUBLIC_SCHOOL_COUNTRY}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-accent h-4 w-4" />
                <span className="text-muted-foreground">{envConfig.NEXT_PUBLIC_SCHOOL_PHONE}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-accent h-4 w-4" />
                <span className="text-muted-foreground">{envConfig.NEXT_PUBLIC_SCHOOL_EMAIL}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-foreground mb-4 font-semibold">Follow Us</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Stay connected with our school community
            </p>
            <div className="flex space-x-3">
              <div className="bg-accent hover:bg-accent/80 flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors">
                <span className="text-accent-foreground text-xs font-bold">f</span>
              </div>
              <div className="bg-accent hover:bg-accent/80 flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors">
                <span className="text-accent-foreground text-xs font-bold">tw</span>
              </div>
              <div className="bg-accent hover:bg-accent/80 flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors">
                <span className="text-accent-foreground text-xs font-bold">ig</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border mb-8" />

        <div className="flex flex-col items-center justify-between text-sm md:flex-row">
          <p className="text-muted-foreground mb-4 md:mb-0">
            © 2025 {envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL}. All rights reserved. | Privacy Policy
            | Terms of Service
          </p>
          <div className="text-muted-foreground flex items-center space-x-4">
            <span>Accessibility</span>
            <span>•</span>
            <span>Sitemap</span>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>EN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
