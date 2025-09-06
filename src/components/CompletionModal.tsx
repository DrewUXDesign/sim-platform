'use client';

import React from 'react';
import { CheckCircle, Trophy, Sparkles, ArrowRight } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

export default function CompletionModal({ isOpen, onContinue }: CompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full mx-auto shadow-2xl overflow-hidden">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">🎉 Congratulations!</h1>
            <p className="text-green-100 text-lg">
              You've completed the guided tutorial!
            </p>
          </div>
          
          {/* Floating sparkles animation */}
          <div className="absolute top-4 left-4 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          <div className="absolute top-8 right-8 animate-bounce delay-300">
            <Sparkles className="w-3 h-3 text-yellow-200" />
          </div>
          <div className="absolute bottom-4 right-4 animate-bounce delay-700">
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              You're Now a Platform Builder! 🏗️
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You've learned the fundamentals of cloud platform architecture and successfully built your first complete platform. 
              You understand how regions, availability zones, compute instances, databases, load balancers, and applications work together!
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-center">🎓 What You've Mastered:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cloud Platform Basics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Infrastructure Design</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Component Relationships</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Application Deployment</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Ready to explore more? You now have full access to all components and can build anything you imagine!
            </p>
            
            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2 group"
            >
              Continue Building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}