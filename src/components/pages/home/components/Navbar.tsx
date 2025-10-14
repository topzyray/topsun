"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/atoms/mode-toggle";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteLogo from "@/components/atoms/site-logo";
import { envConfig } from "@/configs/env.config";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { RouteHelper } from "@/helpers/RouteHelper";
import { User } from "../../../../../types";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userDetails } = useAuth();
  const router = useRouter();

  const portalLoginUrl = RouteHelper.getDashboardPath(userDetails as User);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "programs", label: "Programs" },
    { id: "admissions", label: "Admissions" },
    { id: "news", label: "News" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      // className="shadow-soft sticky top-0 z-50 border-b backdrop-blur-sm transition-colors"
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-transparent" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl rounded-4xl px-4 py-2 shadow-lg backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex items-center justify-center rounded-lg"
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <SiteLogo className="h-10 w-10" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-foreground text-xl font-bold">
                {envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL}
              </h1>
              <p className="text-foreground text-sm italic">{envConfig.NEXT_PUBLIC_SCHOOL_MOTTO}</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden items-center space-x-6 lg:flex"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ y: -2 }}
                onClick={() => scrollToSection(item.id)}
                transition={{ duration: 0.2 }}
                // className="text-foreground hover:text-primary font-medium transition-colors"
                className={`text-shadow relative px-1 py-2 text-base font-semibold transition-colors hover:cursor-pointer ${
                  activeSection === item.id
                    ? "text-yellow-500"
                    : "text-primary text-shadow hover:text-yellow-500"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-0 bottom-0 left-0 h-0.5 bg-yellow-500"
                  />
                )}
              </motion.button>
            ))}
          </motion.nav>

          {/* Right side actions */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Search - Hidden on mobile */}
            <div className="relative hidden md:block">
              <Search className="text-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-foreground placeholder:text-foreground w-40 pl-10 font-bold placeholder:font-bold lg:w-48"
              />
            </div>

            <ThemeToggle />

            {/* Login Button - Hidden on small mobile */}
            <motion.div
              className="hidden sm:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={() => router.push(portalLoginUrl)} size="sm">
                Portal Login
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="hover:bg-muted rounded-md p-2 transition-colors lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-background/95 absolute top-16 right-0 left-0 overflow-hidden border-t shadow-lg backdrop-blur-sm lg:hidden"
          >
            <motion.div
              className="container mx-auto space-y-4 px-4 py-6"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile Search */}
              <div className="relative md:hidden">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>

              {/* Mobile Navigation Links */}
              <motion.nav
                className="space-y-3"
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {navItems.map((item) => (
                  <motion.span
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    whileTap={{ scale: 0.98 }}
                    className="text-foreground hover:text-primary hover:bg-muted block rounded-md px-3 py-2 font-medium transition-colors"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    {item.label}
                  </motion.span>
                ))}
              </motion.nav>

              {/* Mobile Login Button */}
              <motion.div
                className="border-t pt-4 sm:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button onClick={() => router.push(portalLoginUrl)} className="w-full">
                  Portal Login
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
