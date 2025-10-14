"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/animation/carousel";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <HeroCarousel />

      <motion.div
        className="text-primary-foreground relative z-10 mx-auto max-w-4xl rounded-2xl p-6 px-4 text-center backdrop-blur-xs"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Badge className="bg-accent text-accent-foreground mb-4">Welcome to Excellence</Badge>
        </motion.div>
        <motion.h1
          className="text-shadow mb-6 text-4xl leading-tight font-bold text-white md:text-7xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* <StarIcon className="text-gold mr-2 h-5 w-5" /> */}
          Inspiring Young
          <motion.span
            className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Minds to{" "}
            <span>
              <TypeAnimation
                sequence={["Soar", 1000, "Creative", 1000, "Win", 1000]}
                wrapper="span"
                className="text-4xl leading-tight font-bold md:text-7xl"
                repeat={Infinity}
              />
            </span>
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-shadow mb-8 text-xl leading-relaxed font-semibold text-white opacity-90 md:text-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Welcome from our Proprietor: &quot;At Topsun International School, we believe every child
          has the potential to achieve greatness. Our nurturing environment, exceptional teaching,
          and innovative programs prepare students for success in an ever-changing world.&quot;
        </motion.p>
        <motion.div
          className="flex flex-col justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Link href="https://wa.me/2348067990151" target="_blank">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button size="xl" className="px-8 py-4 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Book a Tour
              </Button>
            </motion.div>
          </Link>
          <Link href="mailto:temitopeb588@gmail.com" target="_blank">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button size="xl" variant="secondary" className="bg-accent px-8 py-4 text-lg">
                Apply Now
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
