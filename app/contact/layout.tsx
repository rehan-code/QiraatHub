
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us | QiraatHub",
  description: "Get in touch with QiraatHub for inquiries, support, or more information. We welcome your questions and feedback.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
