"use client";

import { motion } from "framer-motion";

interface PagesHero {
  text: string;
}

export default function PagesHero({ text }: PagesHero) {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-10 pt-24 lg:py-14 lg:pt-28 dark:from-slate-900 dark:to-slate-800">
      <section className="w-full px-6 lg:px-20">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="from-lighterblue to-lightergreen bg-gradient-to-r bg-clip-text text-center text-3xl font-extrabold text-transparent lg:text-5xl"
        >
          {text}
        </motion.h2>
      </section>
    </section>
  );
}
