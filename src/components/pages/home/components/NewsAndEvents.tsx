"use client";

import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsAndEvents() {
  // Refs for scroll-triggered animations
  const newsRef = useRef(null);

  // InView hooks
  const newsInView = useInView(newsRef, { once: true });

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

  const upcomingEvents = [
    { date: "15 Jan", title: "Open Day", type: "Admissions" },
    { date: "22 Jan", title: "Science Fair", type: "Academic" },
    { date: "28 Jan", title: "Talent Concert", type: "Arts" },
    { date: "05 Feb", title: "Parent Evening", type: "Community" },
  ];

  return (
    <section id="news" className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Badge className="mb-4">Latest News</Badge>
            <h2 className="text-foreground mb-8 text-3xl font-bold">School Updates</h2>

            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Academic</Badge>
                    <span className="text-muted-foreground text-sm">2 days ago</span>
                  </div>
                  <CardTitle className="text-lg">Outstanding WAEC Results Celebrated</CardTitle>
                  <CardDescription>
                    Our Year 17 students achieved exceptional results with 95% achieving grades 4-9
                    in English and Mathematics.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Community</Badge>
                    <span className="text-muted-foreground text-sm">1 week ago</span>
                  </div>
                  <CardTitle className="text-lg">New Science Laboratory Opens</CardTitle>
                  <CardDescription>
                    State-of-the-art facilities now available for physics, chemistry, and biology
                    practical work.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Button variant="outline" className="w-full">
                View All News
              </Button>
            </div>
          </div>

          <div>
            <Badge className="mb-4">Upcoming Events</Badge>
            <h2 className="text-foreground mb-8 text-3xl font-bold">School Calendar</h2>

            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-primary text-lg font-bold">{event.date}</div>
                        </div>
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-accent-gradient text-accent-foreground mt-8 rounded-lg p-6">
              <h3 className="mb-2 text-xl font-bold">Newsletter Signup</h3>
              <p className="mb-4 opacity-90">Stay updated with the latest school news and events</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-accent-foreground/10 border-accent-foreground/20 text-accent-foreground placeholder-accent-foreground/70"
                />
                <Button
                  variant="outline"
                  className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
