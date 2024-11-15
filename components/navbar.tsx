import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-8 flex-1">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
            <span className="font-bold text-xl">QiraatHub</span>
          </Link>

          {/* Navigation Links */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  href="/courses"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Courses
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/resources"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Resources
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/about"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/contact"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <Button variant="outline">Book Appointment</Button>
          <Button>Support Us</Button>
        </div>
      </div>
    </div>
  );
}
