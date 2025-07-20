"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserStats from "./UserStats";
import {
  FiHome,
  FiPlus,
  FiList,
  FiBook,
  FiGithub,
  FiMenu,
  FiX,
  FiDownload,
  FiFileText,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiSettings,
  FiEdit,
  FiHeart,
  FiClock,
  FiStar,
  FiShield,
} from "react-icons/fi";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            
            {/* Auth Section */}
            <div className="flex items-center gap-4 ml-6">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* User Dropdown Button */}
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition px-3 py-2 rounded-lg hover:bg-gray-800"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                    <FiChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">
                              {user.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-sm text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* User Stats */}
                      <div className="p-4 border-b border-gray-700">
                        <UserStats />
                      </div>
                      
                      {/* User Actions */}
                      <div className="p-2">
                        <Link
                          href="/cursor-rules/my-rules"
                          className="flex items-center gap-3 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition group"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <FiEdit className="w-4 h-4 group-hover:text-blue-400" />
                          <span>My Rules</span>
                        </Link>
                        
                        <Link
                          href="/cursor-rules/create"
                          className="flex items-center gap-3 w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition group"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <FiPlus className="w-4 h-4 group-hover:text-green-400" />
                          <span>Create Rule</span>
                        </Link>
                        
                        <div className="border-t border-gray-700 my-2"></div>
                        
                        <button
                          onClick={() => {
                            signOut();
                            setIsUserDropdownOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-md transition group"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition"
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
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
              
              {/* Mobile User Section */}
              {user && (
                <>
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    {/* Mobile User Info */}
                    <div className="px-2 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">
                            {user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-sm text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile User Stats */}
                    <div className="px-2 mb-4">
                      <UserStats />
                    </div>
                    
                    {/* Mobile User Actions */}
                    <div className="px-2">
                      <Link
                        href="/cursor-rules/my-rules"
                        className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition px-2 py-3 rounded-md hover:bg-gray-800/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>My Rules</span>
                      </Link>
                      
                      <Link
                        href="/cursor-rules/create"
                        className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition px-2 py-3 rounded-md hover:bg-gray-800/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Create Rule</span>
                      </Link>
                      
                      <div className="border-t border-gray-700 my-3"></div>
                      
                      <button
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition px-2 py-3 rounded-md hover:bg-gray-800/50 w-full text-left"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
