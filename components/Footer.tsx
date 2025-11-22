"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const SocialIcon = ({ name, href }: { name: string; href: string }) => {
  const common = "h-5 w-5";
  const Icon =
    name === "github" ? FaGithub : name === "twitter" ? FaTwitter : FaLinkedin;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="text-foreground/90 hover:text-foreground transition-colors"
    >
      <Icon className={common} />
    </a>
  );
};

export const Footer = () => {
  return (
    <footer className="w-full border-t border-foreground/20 bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 select-none">
              <Image
                src="/assets/logo.png"
                alt="Atah Group"
                width={40}
                height={40}
              />
              <span className="font-bold text-lg text-foreground">
                Atah Group
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm text-foreground/80 text-justify md:text-left">
              Long live the pursuit of knowledge and innovation. Long live
              humanity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col">
              <h4 className="font-semibold text-foreground text-center md:text-left">
                Company
              </h4>
              <nav className="mt-2 flex flex-col text-sm text-foreground/90 items-center md:items-start">
                <Link
                  href="/about"
                  className="py-1 hover:underline text-center md:text-left"
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className="py-1 hover:underline text-center md:text-left"
                >
                  Services
                </Link>
                <Link
                  href="/research"
                  className="py-1 hover:underline text-center md:text-left"
                >
                  Research
                </Link>
              </nav>
            </div>

            <div className="flex flex-col">
              <h4 className="font-semibold text-foreground text-center md:text-left">
                Legal
              </h4>
              <nav className="mt-2 flex flex-col text-sm text-foreground/90 items-center md:items-start">
                <Link
                  href="/legal/terms"
                  className="py-1 hover:underline text-center md:text-left whitespace-nowrap"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/legal/privacy"
                  className="py-1 hover:underline text-center md:text-left"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/legal/cookie"
                  className="py-1 hover:underline text-center md:text-left"
                >
                  Cookie Policy
                </Link>
              </nav>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-foreground text-center md:text-left">
              Follow
            </h4>
            <div className="mt-2 flex items-center gap-3">
              <SocialIcon name="github" href="https://github.com/atahgroup" />
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-foreground/10 pt-4 text-sm text-foreground/70 flex flex-col items-center md:flex-row md:justify-between gap-2 text-center md:text-left">
          <div>
            © {new Date().getFullYear()} Atah Group — All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/legal/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
