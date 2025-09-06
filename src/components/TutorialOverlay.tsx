'use client';

import React from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, X, Lightbulb, Target, Info } from 'lucide-react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  explanation: string;
  targetElement?: string;
  action: 'drag' | 'click' | 'observe';
  component?: string;
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

interface TutorialOverlayProps {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export default function TutorialOverlay({ 
  isActive, 
  currentStep, 
  steps, 
  onNext, 
  onPrevious, 
  onSkip, 
  onComplete 
}: TutorialOverlayProps) {
  if (!isActive || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'drag': return '🖱️';
      case 'click': return '👆';
      case 'observe': return '👀';
      default: return '✨';
    }
  };

  const getPositionClasses = (position?: string) => {
    switch (position) {
      case 'left': return 'left-4 top-1/2 transform -translate-y-1/2';
      case 'right': return 'right-4 top-1/2 transform -translate-y-1/2';
      case 'top': return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom': return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default: return 'top-4 right-4';
    }
  };

  return (
    <>      
      {/* Tutorial Card */}
      <div className={`fixed z-50 ${getPositionClasses(step.position)} max-w-sm`}>
        <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-200 overflow-hidden ring-4 ring-blue-100 ring-opacity-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getActionIcon(step.action)}</span>
                <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
              </div>
              <button
                onClick={onSkip}
                className="text-white hover:text-gray-200 transition-colors"
                title="Skip tutorial"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              {step.title}
            </h3>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              {step.description}
            </p>

            {/* ELI5 Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">Simple Explanation:</p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">What to do:</span>
              </div>
              <p className="text-sm text-gray-700">
                {step.action === 'drag' && '🖱️ Drag and drop the component'}
                {step.action === 'click' && '👆 Click on the highlighted area'}
                {step.action === 'observe' && '👀 Watch what happens next'}
                {step.component && ` - Look for "${step.component}"`}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={onPrevious}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isFirstStep
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {isLastStep ? (
                <button
                  onClick={onComplete}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}