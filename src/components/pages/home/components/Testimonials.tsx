"use client";

import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Testimonials() {
  // Refs for scroll-triggered animations
  const testimonialsRef = useRef(null);

  // InView hooks
  const testimonialsInView = useInView(testimonialsRef, { once: true });

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

  const testimonials = [
    {
      name: "Adebolu Ayodeji",
      role: "Parent of Year 8 Student",
      content:
        "The transformation in my daughter's confidence and academic performance has been remarkable. The teachers genuinely care about each child's success.",
      rating: 5,
    },
    {
      name: "Michael Ojopagog",
      role: "Alumni, Class of 2022",
      content:
        "The skills and friendships I gained here have been invaluable. The university preparation was outstanding - I felt fully prepared for the next chapter.",
      rating: 5,
    },
    {
      name: "Agbetuyi Tolulope",
      role: "Parent of Year 11 Student",
      content:
        "The pastoral care and communication from staff is exceptional. We always feel informed and supported in our son's educational journey.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <Badge className="mb-4">What Families Say</Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold">Testimonials</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="shadow-medium hover:shadow-large transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="fill-accent text-accent h-5 w-5" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-4 italic">
                  &quot;{testimonial.content}&quot;
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
