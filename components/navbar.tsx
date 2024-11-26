import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
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
} from "@/components/ui/sheet";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-20 md:h-24 items-center px-4 md:px-32 container mx-auto place-content-between">
        <div className="flex items-start">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={80}
              className="w-[40px] md:w-[60px] h-auto "
            />
          </Link>
        </div>
        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex w-full">
          <NavigationMenuList className="flex justify-evenly w-full gap-12">
            <NavigationMenuItem>
              <Link
                href="/courses"
                className="text-md font-medium transition-colors hover:text-theme_primary"
              >
                Courses
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-md font-medium transition-colors hover:text-theme_primary">
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[180px] gap-3 p-3">
                  <li>
                    <Link
                      href="/resources/downloads"
                      className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Downloads
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/resources/video-library"
                      className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Video Library
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/resources/audio"
                      className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Audio Resources
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/about"
                className="text-md font-medium transition-colors hover:text-theme_primary"
              >
                About
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/contact"
                className="text-md font-medium transition-colors hover:text-theme_primary"
              >
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side buttons - Desktop */}
        <div className="hidden md:flex items-end space-x-4">
          <Button
            variant="outline"
            size={"lg"}
            className="bg-theme_primary hover:bg-theme_primary hover:brightness-90"
          >
            Book Appointment
          </Button>
          <Button variant="outline" size={"lg"}>
            Login
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="scale-125">
                <Menu className="h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/courses"
                  className="block py-2 text-lg font-medium transition-colors hover:text-theme_primary"
                >
                  Courses
                </Link>
                <div className="py-2">
                  <p className="text-lg font-medium mb-2">Resources</p>
                  <div className="pl-4 flex flex-col gap-2">
                    <Link
                      href="/resources/downloads"
                      className="block py-1 transition-colors hover:text-theme_primary"
                    >
                      Downloads
                    </Link>
                    <Link
                      href="/resources/video-library"
                      className="block py-1 transition-colors hover:text-theme_primary"
                    >
                      Video Library
                    </Link>
                    <Link
                      href="/resources/audio"
                      className="block py-1 transition-colors hover:text-theme_primary"
                    >
                      Audio Resources
                    </Link>
                  </div>
                </div>
                <Link
                  href="/about"
                  className="block py-2 text-lg font-medium transition-colors hover:text-theme_primary"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block py-2 text-lg font-medium transition-colors hover:text-theme_primary"
                >
                  Contact
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full bg-theme_primary hover:bg-theme_primary hover:brightness-90"
                  >
                    Book Appointment
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Login
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
