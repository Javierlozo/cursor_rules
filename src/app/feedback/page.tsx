"use client";

import { useState } from "react";
import { FiAlertTriangle, FiStar, FiMessageSquare, FiSend, FiCheck } from "react-icons/fi";

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<"bug" | "feature" | "general">("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create email content
      const emailSubject = `[Cursor Rules Hub Feedback] ${feedbackType.toUpperCase()}: ${subject}`;
      const emailBody = `
Feedback Type: ${feedbackType.toUpperCase()}
Subject: ${subject}
Message: ${message}
User Email: ${email || "Not provided"}
Date: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
      `.trim();

      // Open default email client
                        const mailtoLink = `mailto:luis.lozoya.tech@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink);

      setIsSubmitted(true);
      setSubject("");
      setMessage("");
      setEmail("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case "bug":
        return <FiAlertTriangle className="w-6 h-6 text-red-400" />;
      case "feature":
        return <FiStar className="w-6 h-6 text-yellow-400" />;
      default:
        return <FiMessageSquare className="w-6 h-6 text-blue-400" />;
    }
  };

  const getFeedbackTitle = () => {
    switch (feedbackType) {
      case "bug":
        return "Report a Bug";
      case "feature":
        return "Request a Feature";
      default:
        return "Send Feedback";
    }
  };

  const getFeedbackDescription = () => {
    switch (feedbackType) {
      case "bug":
        return "Found something that's not working? Let us know so we can fix it!";
      case "feature":
        return "Have an idea for a new feature? We'd love to hear about it!";
      default:
        return "Have general feedback or suggestions? We're all ears!";
    }
  };

  if (isSubmitted) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
              <p className="text-gray-400 mb-6">
                Your feedback has been submitted. We'll review it and get back to you soon.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Submit More Feedback
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Feedback</h1>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {getFeedbackIcon()}
            </div>
            <h2 className="text-2xl font-semibold mb-2">{getFeedbackTitle()}</h2>
            <p className="text-gray-400">{getFeedbackDescription()}</p>
          </div>

          {/* Feedback Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-3">
              What type of feedback do you have?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                             <button
                 type="button"
                 onClick={() => setFeedbackType("bug")}
                 className={`p-4 rounded-lg border transition ${
                   feedbackType === "bug"
                     ? "border-red-500 bg-red-900/20 text-red-300"
                     : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                 }`}
               >
                 <FiAlertTriangle className="w-5 h-5 mx-auto mb-2" />
                 <span className="text-sm">Bug Report</span>
               </button>
               <button
                 type="button"
                 onClick={() => setFeedbackType("feature")}
                 className={`p-4 rounded-lg border transition ${
                   feedbackType === "feature"
                     ? "border-yellow-500 bg-yellow-900/20 text-yellow-300"
                     : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                 }`}
               >
                 <FiStar className="w-5 h-5 mx-auto mb-2" />
                 <span className="text-sm">Feature Request</span>
               </button>
              <button
                type="button"
                onClick={() => setFeedbackType("general")}
                className={`p-4 rounded-lg border transition ${
                  feedbackType === "general"
                    ? "border-blue-500 bg-blue-900/20 text-blue-300"
                    : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                }`}
              >
                <FiMessageSquare className="w-5 h-5 mx-auto mb-2" />
                <span className="text-sm">General Feedback</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of your feedback"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                placeholder="Please provide detailed information about your feedback..."
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Your Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll use this to follow up on your feedback if needed
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !subject.trim() || !message.trim()}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiSend className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-300 mb-2">How it works</h3>
                        <ul className="text-sm text-blue-200 space-y-1">
                          <li>• Your feedback will be sent via email to luis.lozoya.tech@gmail.com</li>
                          <li>• We'll review and respond to all feedback</li>
                          <li>• For bug reports, please include steps to reproduce</li>
                          <li>• For feature requests, explain the use case and benefits</li>
                        </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 