"use client";

import { useState } from "react";
import { FiX, FiArrowRight, FiCheck, FiCode, FiSearch, FiPlus } from "react-icons/fi";
import Link from "next/link";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Cursor Rules Hub! 🎉",
    description: "Share and discover AI behavior rules for Cursor Editor.",
    icon: FiCode,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Cursor Rules are system-level instructions that control how the Cursor AI behaves. 
          They provide persistent, reusable context for generating code.
        </p>
        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
          <h4 className="font-semibold text-blue-300 mb-2">What you can do:</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Browse community rules by category and framework</li>
            <li>• Create and share your own coding patterns</li>
            <li>• Use rules in your projects via .cursor/rules directory</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Get Started",
    description: "Choose how you'd like to begin your journey.",
    icon: FiArrowRight,
    content: null // Will be handled dynamically
  }
];

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  // Create content with onClose function
  const stepContent = currentStep === 1 ? (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Link
          href="/cursor-rules"
          className="flex items-center gap-3 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg hover:bg-blue-900/30 transition"
          onClick={() => onClose()}
        >
          <FiSearch className="text-blue-400" />
          <div>
            <p className="font-medium text-blue-300">Browse Community Rules</p>
            <p className="text-sm text-blue-200">Discover patterns from other developers</p>
          </div>
        </Link>
        
        <Link
          href="/cursor-rules/create"
          className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-700/30 rounded-lg hover:bg-green-900/30 transition"
          onClick={() => onClose()}
        >
          <FiPlus className="text-green-400" />
          <div>
            <p className="font-medium text-green-300">Create Your First Rule</p>
            <p className="text-sm text-green-200">Share your coding patterns</p>
          </div>
        </Link>
      </div>
    </div>
  ) : step.content;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <IconComponent className="text-2xl text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold">{step.title}</h2>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {stepContent}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="flex gap-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <FiCheck className="text-sm" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <FiArrowRight className="text-sm" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 