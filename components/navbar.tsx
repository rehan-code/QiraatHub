'use client';

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-50 bg-white border-b border-slate-200/80 text-primary"
    >
      <div className="flex h-20 items-center px-4 md:px-8 lg:px-32 container mx-auto">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={60}
                height={80}
                className="w-[40px] h-auto transition-all duration-300 group-hover:brightness-110"
              />
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex mx-auto">
          <NavigationMenuList className="flex gap-1">
            {/* Qiraat Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-12 px-5 text-base font-medium transition-all duration-200 hover:text-theme_primary data-[state=open]:hover:text-theme_primary data-[state=open]:bg-slate-100/80 rounded-full">
                Qiraat
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-[430px] p-2 bg-white"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Nafi' al-Madani", slug: "nafi-al-madani" },
                      { name: "Ibn Kathir", slug: "ibn-kathir" },
                      { name: "Abu Amr Basri", slug: "abu-amr-basri" },
                      { name: "Ibn Amir Shami", slug: "ibn-amir-shami" },
                      { name: "Asim Al Koofi", slug: "asim-al-koofi" },
                      { name: "Hamza Al Kufi", slug: "hamza-al-kufi" },
                      { name: "Al-Kisa'i", slug: "al-kisai" },
                      { name: "Abu Jaafar", slug: "abu-jaafar" },
                      { name: "Yaqub Hadrani", slug: "yaqub-hadrani" },
                      { name: "Khalaf Al Ashir", slug: "khalaf-al-ashir" },
                    ].map((scholar) => (
                      <Link
                        key={scholar.slug}
                        href={`/qiraat/${scholar.slug}`}
                        className="block p-3 text-base rounded-xl transition-all duration-200 hover:bg-slate-100/80 hover:text-theme_primary"
                      >
                        {scholar.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/quran"
                className="h-12 px-5 text-base font-medium transition-all duration-200 hover:text-theme_primary inline-flex items-center justify-center rounded-full hover:bg-slate-100/80"
              >
                Quran
              </Link>
            </NavigationMenuItem>

            {/* Resources Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-12 px-5 text-base font-medium transition-all duration-200 hover:text-theme_primary data-[state=open]:hover:text-theme_primary data-[state=open]:bg-slate-100/80 rounded-full">
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-[220px] p-2 bg-white"
                >
                  <div className="grid gap-3">
                    {[
                      { name: "Audio Resources", href: "/resources/audio" },
                      { name: "Books", href: "/resources/books" },
                      { name: "Video Library", href: "/resources/video" },
                    ].map((resource) => (
                      <Link
                        key={resource.href}
                        href={resource.href}
                        className="block p-3 text-base rounded-xl transition-all duration-200 hover:bg-slate-100/80 hover:text-theme_primary"
                      >
                        {resource.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* About & Contact */}
            {[
              { name: "Blog", href: "/blog" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className="h-12 px-5 text-base font-medium transition-all duration-200 hover:text-theme_primary inline-flex items-center justify-center rounded-full hover:bg-slate-100/80"
                >
                  {item.name}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto z-50">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative scale-125">
                <Menu className="h-6 w-6 transition-all duration-200 rotate-0 scale-100" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[400px] p-0 bg-gradient-to-b from-white to-slate-50 border-l border-slate-200/80"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-5 border-b border-slate-200/80 bg-white">
                  <span className="text-xl font-semibold text-slate-900">Menu</span>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-slate-100/80 active:bg-slate-200/80"
                    >
                      <X className="h-5 w-5 text-slate-600" />
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex-1 overflow-y-auto">
                  <div className="flex flex-col p-5 px-6 space-y-5">
                    {/* Mobile Qiraat Menu */}
                    <div className="space-y-2">
                      <h2 className="text-base font-semibold text-slate-400 uppercase tracking-wider">
                        Qiraat
                      </h2>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: "Nafi' al-Madani", slug: "nafi-al-madani" },
                          { name: "Ibn Kathir", slug: "ibn-kathir" },
                          { name: "Abu Amr Basri", slug: "abu-amr-basri" },
                          { name: "Ibn Amir Shami", slug: "ibn-amir-shami" },
                          { name: "Asim Al Koofi", slug: "asim-al-koofi" },
                          { name: "Hamza Al Kufi", slug: "hamza-al-kufi" },
                          { name: "Al-Kisa'i", slug: "al-kisai" },
                          { name: "Abu Jaafar", slug: "abu-jaafar" },
                          { name: "Yaqub Hadrani", slug: "yaqub-hadrani" },
                          { name: "Khalaf Al Ashir", slug: "khalaf-al-ashir" },
                        ].map((scholar) => (
                          <Link
                            key={scholar.slug}
                            href={`/qiraat/${scholar.slug}`}
                            className="block px-4 py-3 text-base text-slate-700 font-medium rounded-xl bg-white border border-slate-200/80 active:bg-slate-100 active:scale-[0.98] transition-transform"
                            onClick={() => setIsOpen(false)}
                          >
                            {scholar.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Resources Menu */}
                    <div className="space-y-2">
                      <h2 className="text-base font-semibold text-slate-400 uppercase tracking-wider">
                        Resources
                      </h2>
                      <div className="grid gap-2">
                        {[
                          { name: "Books", href: "/resources/books" },
                          { name: "Video Library", href: "/resources/video" },
                          { name: "Audio Resources", href: "/resources/audio" },
                        ].map((resource) => (
                          <Link
                            key={resource.href}
                            href={resource.href}
                            className="block px-4 py-3 text-base text-slate-700 font-medium rounded-xl bg-white border border-slate-200/80 active:bg-slate-100 active:scale-[0.98] transition-transform"
                            onClick={() => setIsOpen(false)}
                          >
                            {resource.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Mobile About & Contact */}
                    <div className="space-y-2">
                      <h2 className="text-base font-semibold text-slate-400 uppercase tracking-wider">
                        Navigation
                      </h2>
                      <div className="grid gap-2">
                        {[
                          { name: "Quran", href: "/quran" },
                          { name: "Blog", href: "/blog" },
                          { name: "About", href: "/about" },
                          { name: "Contact", href: "/contact" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 text-base text-slate-700 font-medium rounded-xl bg-white border border-slate-200/80 active:bg-slate-100 active:scale-[0.98] transition-transform"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.div>
  );
}
