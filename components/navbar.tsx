import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-24 items-center px-32 container mx-auto place-content-between">
        <div className="flex items-start">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={60} height={60} />
          </Link>
        </div>
        {/* Navigation Links */}
        <NavigationMenu className="w-full">
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

        {/* Right side buttons */}
        <div className="flex items-end space-x-4">
          <Button
            variant="outline"
            size={"lg"}
            className="bg-theme_primary hover:bg-theme_primary hover:brightness-90"
          >
            Book Appointment
          </Button>
          <Button
            size={"lg"}
            className="bg-theme_secondary hover:bg-slate-800 hover:brightness-90"
          >
            Support Us
          </Button>
        </div>
      </div>
    </div>
  );
}
