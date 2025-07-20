"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiHome,
  FiPlus,
  FiList,
  FiCommand,
  FiBook,
  FiGithub,
  FiMenu,
  FiX,
  FiDownload,
  FiFileText,
} from "react-icons/fi";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? "text-blue-500" : "text-gray-600";
  };

  const navLinks = [
    { href: "/", icon: <FiHome className="w-5 h-5" />, label: "Home" },
    {
      href: "/cursor-rules",
      icon: <FiList className="w-5 h-5" />,
      label: "Browse",
    },
    {
      href: "/cursor-rules/create",
      icon: <FiPlus className="w-5 h-5" />,
      label: "Create",
    },
    {
      href: "/cursor-rules/templates",
      icon: <FiFileText className="w-5 h-5" />,
      label: "Templates",
    },
    {
      href: "/about",
      icon: <FiBook className="w-5 h-5" />,
      label: "About",
    },
    {
      href: "https://docs.cursor.sh",
      icon: <FiBook className="w-5 h-5" />,
      label: "Docs",
      external: true,
    },
    {
      href: "https://github.com/getcursor/cursor",
      icon: <FiGithub className="w-5 h-5" />,
      label: "GitHub",
      external: true,
    },
  ];

  return (
    <header className="border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="text-xl font-bold flex items-center gap-2 text-white"
          >
            <FiDownload className="w-6 h-6" />
            Cursor Rules
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 hover:text-blue-400 transition ${
                    isActive(link.href) ? "text-blue-400" : "text-gray-300"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-blue-400 transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 bg-gray-900">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition px-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 hover:text-blue-400 transition px-2 ${
                      isActive(link.href) ? "text-blue-400" : "text-gray-300"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
