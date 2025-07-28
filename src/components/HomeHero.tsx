"use client";

import { useState } from "react";
import Link from "next/link";
import OnboardingModal from "./OnboardingModal";

export default function HomeHero() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <>
      <section className="text-center mb-16">
        <div className="flex justify-center mb-8">
          <img 
            src="/Logo.png" 
            alt="Cursor Rules Hub" 
            className="h-24 w-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-8">Cursor Rules Hub</h1>
        <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
          An independent community platform for sharing and discovering Cursor rules. 
          Built by developers, for developers.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/cursor-rules"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Browse Rules
          </Link>
          <Link
            href="/cursor-rules/create"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium"
          >
            Create Rule
          </Link>
          <button
            onClick={() => setShowOnboarding(true)}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-medium"
          >
            Quick Tour
          </button>
        </div>
      </section>

      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </>
  );
} 