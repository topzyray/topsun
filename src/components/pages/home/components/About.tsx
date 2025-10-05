"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Heart, Zap, Shield } from "lucide-react";

export default function About() {
  // Refs for scroll-triggered animations
  const aboutRef = useRef(null);

  // InView hooks
  const aboutInView = useInView(aboutRef, { once: true });

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

  const programs = [
    {
      title: "Academic Excellence",
      description: "Rigorous curriculum with personalized learning approaches",
      icon: BookOpen,
      features: ["STEM Focus", "Language Programs", "Advanced Placement"],
    },
    {
      title: "Character Development",
      description: "Building confidence, resilience, and leadership skills",
      icon: Heart,
      features: ["Leadership Training", "Community Service", "Mentorship Programs"],
    },
    {
      title: "Innovation & Technology",
      description: "Cutting-edge facilities and digital literacy programs",
      icon: Zap,
      features: ["Maker Spaces", "Coding Curriculum", "AI & Robotics"],
    },
    {
      title: "Pastoral Care",
      description: "Comprehensive support for every student's wellbeing",
      icon: Shield,
      features: ["Counseling Services", "Peer Support", "Family Liaison"],
    },
  ];

  return (
    <section id="about" className="bg-muted/30 py-20" ref={aboutRef}>
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4">Our Story</Badge>
          <h2 className="text-foreground mb-6 text-4xl font-bold">
            Building Tomorrow&apos;s Leaders
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            For over 5 years, Topsun College has been at the forefront of educational excellence,
            preparing students not just for exams, but for life.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="initial"
          animate={aboutInView ? "animate" : "initial"}
        >
          {programs.map((program, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="shadow-medium hover:shadow-large group border-0 transition-all duration-300">
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <CardHeader className="text-center">
                    <motion.div
                      className="bg-hero-gradient mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <program.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl">{program.title}</CardTitle>
                    <CardDescription className="text-base">{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                        >
                          <motion.div
                            className="bg-accent mr-3 h-2 w-2 rounded-full"
                            initial={{ scale: 0 }}
                            animate={aboutInView ? { scale: 1 } : { scale: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                          ></motion.div>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
