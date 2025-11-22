"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";

const NavBarItem = (props: {
  label: string;
  href: string;
  onClick?: () => void;
}) => {
  return (
    <Link
      href={props.href}
      className="w-full text-center py-2 px-6 cursor-pointer text-foreground transition duration-200 hover:underline hover:underline-offset-4 whitespace-nowrap"
      onClick={props.onClick}
    >
      {props.label}
    </Link>
  );
};

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const close = () => setOpen(false);

  // Apply CSS variable overrides for the chosen theme.
  const applyTheme = (t: "light" | "dark") => {
    const root = document.documentElement;
    if (t === "dark") {
      root.style.setProperty("--background", "#121212");
      root.style.setProperty("--foreground", "#ededed");
    } else {
      root.style.setProperty("--background", "#ffffff");
      root.style.setProperty("--foreground", "#171717");
    }
  };

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };

  return (
    <header className="w-full border-b border-foreground/30 bg-background">
      <div className="w-full mx-auto flex px-4 py-2">
        <div className="w-full flex items-center select-none space-x-2 mr-8">
          <Image
            src="/assets/logo.png"
            alt="Atah Group Logo"
            width={40}
            height={40}
          />
          <span className="font-bold text-2xl text-foreground whitespace-nowrap">
            Atah
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center md:space-x-3">
          <NavBarItem label="Home" href="/" />
          <NavBarItem
            label="Services"
            href="https://www.atahgroup.com/services"
          />
          <NavBarItem label="About" href="https://www.atahgroup.com/about" />
          <NavBarItem
            label="Contact Us"
            href="https://www.atahgroup.com/contact"
          />
        </nav>

        {/* Theme toggle */}
        <div className="hidden md:flex md:items-center md:ml-2">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="p-2 rounded-md hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/30"
          >
            {theme === "dark" ? (
              <FiSun className="h-5 w-5 text-foreground" />
            ) : (
              <FiMoon className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/30"
          >
            <span className="sr-only">Open main menu</span>
            {open ? (
              <FiX className="h-6 w-6" aria-hidden />
            ) : (
              <FiMenu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-max-h duration-300 ease-in-out overflow-hidden bg-background/95 dark:bg-background/90 ${
          open ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center py-4 space-y-4">
          {/* Mobile theme toggle */}
          <div className="flex items-center justify-center w-full">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } mode`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/30"
            >
              {theme === "dark" ? (
                <FiSun className="h-5 w-5 text-foreground" />
              ) : (
                <FiMoon className="h-5 w-5 text-foreground" />
              )}
              <span className="text-foreground/90 text-sm">
                {theme === "dark" ? "Light" : "Dark"} mode
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center w-full py-2 space-y-2">
            <NavBarItem label="Home" href="/" onClick={close} />
            <NavBarItem
              label="Services"
              href="https://www.atahgroup.com/services"
              onClick={close}
            />
            <NavBarItem
              label="Research"
              href="https://www.atahgroup.com/research"
              onClick={close}
            />
            <NavBarItem
              label="About"
              href="https://www.atahgroup.com/about"
              onClick={close}
            />
            <NavBarItem
              label="Contact Us"
              href="https://www.atahgroup.com/contact"
              onClick={close}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
