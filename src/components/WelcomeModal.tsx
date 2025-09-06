'use client';

import React from 'react';
import { BookOpen, Zap, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onChooseGuided: () => void;
  onChooseFreestyle: () => void;
}

export default function WelcomeModal({ isOpen, onChooseGuided, onChooseFreestyle }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-auto shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Platform Simulator! 🚀
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              Build and manage cloud platforms like the pros! No technical background needed.
            </p>
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Guided Experience */}
            <button
              onClick={onChooseGuided}
              className="group relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-left transition-all hover:border-blue-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  🎓 Guided Experience
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Perfect for beginners! I'll walk you through building your first platform step-by-step, 
                  explaining everything in simple terms.
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  ✨ What you'll learn:
                </div>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• How cloud platforms work</li>
                  <li>• Building your first region</li>
                  <li>• Adding servers and databases</li>
                  <li>• Deploying your first app</li>
                </ul>
                <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-transparent opacity-20 rounded-full transform translate-x-8 -translate-y-8"></div>
            </button>

            {/* Freestyle Experience */}
            <button
              onClick={onChooseFreestyle}
              className="group relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 text-left transition-all hover:border-purple-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ⚡ Freestyle Mode
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  Jump right in and explore! Perfect if you already know the basics or want to 
                  experiment freely with platform building.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  🛠️ What you can do:
                </div>
                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li>• Build any platform design</li>
                  <li>• Access all components</li>
                  <li>• Create complex architectures</li>
                  <li>• Full creative control</li>
                </ul>
                <div className="mt-4 flex items-center text-purple-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Start Building <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200 to-transparent opacity-20 rounded-full transform translate-x-8 -translate-y-8"></div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don't worry - you can always switch modes later! 
              <span className="block mt-1">Ready to build something amazing?</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}