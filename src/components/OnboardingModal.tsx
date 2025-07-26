"use client";

import { useState } from "react";
import { FiX, FiArrowRight, FiArrowLeft, FiCheck, FiCode, FiUsers, FiSearch, FiPlus } from "react-icons/fi";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Cursor Rules Hub! 🎉",
    description: "Discover how AI behavior instructions can transform your coding workflow.",
    icon: FiCode,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Cursor Rules Hub is a community-driven platform where developers share and discover 
          AI behavior rules for the Cursor Editor.
        </p>
        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/30">
          <h4 className="font-semibold text-blue-300 mb-2">What are Cursor Rules?</h4>
          <p className="text-blue-200 text-sm">
            System-level instructions that control how the Cursor AI behaves. They provide 
            persistent, reusable context for generating code and interpreting edits.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Browse Community Rules",
    description: "Discover rules created by other developers for various frameworks and patterns.",
    icon: FiSearch,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Explore the community rules library to find patterns that match your needs.
        </p>
        <div className="grid gap-3">
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
            <div>
              <p className="font-medium">Search by category, framework, or tags</p>
              <p className="text-sm text-gray-400">Find rules for React, TypeScript, Testing, etc.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
            <div>
              <p className="font-medium">Preview rule content</p>
              <p className="text-sm text-gray-400">See exactly what the rule does before using it</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
            <div>
              <p className="font-medium">Copy and use in your project</p>
              <p className="text-sm text-gray-400">Save to your .cursor/rules directory</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Create Your Own Rules",
    description: "Share your coding patterns and help the community grow.",
    icon: FiPlus,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Create rules that reflect your team's coding standards and best practices.
        </p>
        <div className="bg-green-900/20 p-4 rounded-lg border border-green-700/30">
          <h4 className="font-semibold text-green-300 mb-2">Rule Creation Tips</h4>
          <ul className="text-green-200 text-sm space-y-1">
            <li>• Write clear, specific instructions</li>
            <li>• Include code examples and templates</li>
            <li>• Use descriptive names and tags</li>
            <li>• Test your rules before sharing</li>
          </ul>
        </div>
        <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30">
          <h4 className="font-semibold text-yellow-300 mb-2">Rule Types</h4>
          <ul className="text-yellow-200 text-sm space-y-1">
            <li>• <strong>Always:</strong> Always included in model context</li>
            <li>• <strong>Auto Attached:</strong> Applied to matching file patterns</li>
            <li>• <strong>Manual:</strong> Explicitly mentioned with @ruleName</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Using Rules in Cursor",
    description: "Learn how to apply rules to your projects.",
    icon: FiCheck,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Once you have rules, here's how to use them in Cursor Editor.
        </p>
        <div className="space-y-3">
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-white mb-2">Project Rules</h4>
            <p className="text-gray-300 text-sm mb-2">
              Store in <code className="bg-gray-900 px-1 rounded text-blue-300">.cursor/rules</code> directory:
            </p>
            <div className="bg-gray-900 p-3 rounded text-sm font-mono text-gray-300">
              <div>📁 your-project/</div>
              <div>  📁 .cursor/</div>
              <div>    📁 rules/</div>
              <div>      📄 react-patterns.md</div>
              <div>      📄 api-standards.md</div>
            </div>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-white mb-2">Global Rules</h4>
            <p className="text-gray-300 text-sm">
              Set in Cursor Settings → Rules for patterns that apply across all projects.
            </p>
          </div>
        </div>
      </div>
    )
  }
];

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const currentStepData = onboardingSteps.find(step => step.id === currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === onboardingSteps.length;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              {currentStepData?.icon && <currentStepData.icon className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{currentStepData?.title}</h2>
              <p className="text-gray-400 text-sm">{currentStepData?.description}</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData?.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="flex gap-2">
            {onboardingSteps.map((step) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full ${
                  step.id === currentStep ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition"
              >
                <FiArrowLeft size={16} />
                Previous
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {isLastStep ? (
                <>
                  <FiCheck size={16} />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 