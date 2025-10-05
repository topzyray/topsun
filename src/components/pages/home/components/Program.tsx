"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Program() {
  // Refs for scroll-triggered animations
  const programsRef = useRef(null);

  // InView hooks
  const programsInView = useInView(programsRef, { once: true });

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
    <section id="programs" className="py-20" ref={programsRef}>
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={programsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4">Our Programs</Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold">Comprehensive Education</h2>
        </motion.div>

        <motion.div
          className="grid gap-8 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          animate={programsInView ? "animate" : "initial"}
        >
          {[
            {
              image: "/images/classroom.jpg",
              title: "Academic Excellence",
              desc: "Our rigorous academic program challenges students while providing the support they need to succeed.",
            },
            {
              image: "/images/sports.jpg",
              title: "Sports & Wellness",
              desc: "Comprehensive sports programs that build character, teamwork, and physical fitness.",
            },
            {
              image: "/images/library.jpg",
              title: "Arts & Culture",
              desc: "Creative programs that nurture artistic expression and cultural understanding.",
            },
          ].map((item, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="shadow-medium hover:shadow-large group overflow-hidden transition-all duration-300">
                <motion.div
                  className="relative h-48 overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-black/20"
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="school" className="w-full">
                      Learn More
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
