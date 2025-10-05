"use client";

import React, { useRef } from "react";
import { Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInView } from "framer-motion";

export default function Admissions() {
  // Refs for scroll-triggered animations

  const admissionsRef = useRef(null);

  // InView hooks
  const admissionsInView = useInView(admissionsRef, { once: true });

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
    <section id="admissions" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <Badge className="mb-4">Join Our Community</Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold">Admissions & Enrollment</h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            Begin your child&apos;s journey with us. Our admissions process is designed to be
            welcoming and comprehensive.
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="bg-hero-gradient text-primary-foreground rounded-lg p-8">
              <h3 className="mb-4 text-2xl font-bold">Digital Prospectus</h3>
              <p className="mb-6 opacity-90">
                Download our comprehensive guide to life at Topsun College, including curriculum
                details, facilities information, and student life.
              </p>
              <Button
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Download Prospectus
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-6 text-center">
                <Users className="text-primary mx-auto mb-2 h-8 w-8" />
                <h4 className="font-semibold">Small Classes</h4>
                <p className="text-muted-foreground text-sm">Average 18 students per class</p>
              </div>
              <div className="rounded-lg border p-6 text-center">
                <Award className="text-primary mx-auto mb-2 h-8 w-8" />
                <h4 className="font-semibold">Outstanding Results</h4>
                <p className="text-muted-foreground text-sm">95% university acceptance rate</p>
              </div>
            </div>
          </div>

          <Card className="shadow-large">
            <CardHeader>
              <CardTitle>Enrollment Inquiry</CardTitle>
              <CardDescription>
                Submit your initial inquiry and we&apos;ll be in touch within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Parent/Guardian Name *</label>
                  <Input placeholder="Full name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address *</label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input placeholder="Phone number" />
                </div>
                <div>
                  <label className="text-sm font-medium">Student&apos;s Year Group</label>
                  <Input placeholder="e.g., Year 7" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Tell us about your child's interests and any specific questions..."
                  className="h-24"
                />
              </div>
              <Button variant="cta" className="w-full" size="lg">
                Submit Inquiry
              </Button>
              <p className="text-muted-foreground text-center text-xs">
                By submitting this form, you agree to our privacy policy. We&apos;ll never share
                your information.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
