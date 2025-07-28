import Link from "next/link";
import { FiGithub, FiMessageSquare } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-auto bg-gray-900/95 backdrop-blur-sm text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src="/Logo.png" 
                alt="Cursor Rules Hub" 
                className="h-8 w-auto"
                />
              <h3 className="font-semibold text-white">
                About Cursor Rules Hub
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              A community-driven collection of AI behavior rules for the Cursor
              editor. Share and discover rules to enhance your coding
              experience.
            </p>
            <div className="mt-3">
              <Link
                href="/about"
                className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
              >
                Learn More →
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="font-semibold mb-3 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/cursor-rules"
                  className="text-gray-400 hover:text-blue-400"
                >
                  Browse Rules
                </Link>
              </li>
              <li>
                <Link
                  href="/cursor-rules/create"
                  className="text-gray-400 hover:text-blue-400"
                >
                  Create Rule
                </Link>
              </li>
              <li>
                <a
                  href="https://cursor.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 inline-flex items-center gap-2"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  Download Cursor
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="font-semibold mb-3 text-white">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://docs.cursor.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400"
                >
                  Cursor Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://docs.cursor.sh/ai-rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400"
                >
                  AI Rules Guide
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/getcursor/cursor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 inline-flex items-center gap-2"
                >
                  <FiGithub className="w-4 h-4" />
                  Cursor GitHub
                </a>
              </li>

            </ul>
          </div>

          {/* Feedback */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="font-semibold mb-3 text-white">Help & Feedback</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/feedback"
                  className="text-gray-400 hover:text-blue-400 inline-flex items-center gap-2"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  Send Feedback
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-gray-400 hover:text-blue-400"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-blue-400"
                >
                  About the Project
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Developer Credit */}
        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-sm text-gray-400 bg-gray-800/50 rounded-xl p-4">
          <p className="mt-1 mb-2">
            © {new Date().getFullYear()} Cursor Rules Hub. Not affiliated with
            Cursor Editor.
          </p>
          <p className="text-xs text-gray-500">
            Built with expertise by{" "}
            <Link
              href="/about#developer"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Luis Lozoya
            </Link>
            {" "}• Senior Full Stack Engineer
          </p>
        </div>
      </div>
    </footer>
  );
}
