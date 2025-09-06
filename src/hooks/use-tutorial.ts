'use client';

import { useState, useCallback } from 'react';
import { guidedTutorialSteps } from '@/lib/tutorial-steps';
import { InfrastructureType } from '@/types/platform';

export type TutorialMode = 'welcome' | 'guided' | 'freestyle' | 'completed';

export function useTutorial() {
  const [mode, setMode] = useState<TutorialMode>('welcome');
  const [currentStep, setCurrentStep] = useState(0);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);

  const startGuided = useCallback(() => {
    setMode('guided');
    setCurrentStep(0);
    setIsWelcomeModalOpen(false);
  }, []);

  const startFreestyle = useCallback(() => {
    setMode('freestyle');
    setIsWelcomeModalOpen(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < guidedTutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTutorial();
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipTutorial = useCallback(() => {
    setMode('freestyle');
  }, []);

  const completeTutorial = useCallback(() => {
    setMode('completed');
  }, []);

  const resetTutorial = useCallback(() => {
    setMode('welcome');
    setCurrentStep(0);
    setIsWelcomeModalOpen(true);
  }, []);

  return {
    mode,
    currentStep,
    isWelcomeModalOpen,
    steps: guidedTutorialSteps,
    startGuided,
    startFreestyle,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    resetTutorial,
    isGuidedMode: mode === 'guided',
    isFreestyleMode: mode === 'freestyle',
    isTutorialComplete: mode === 'completed'
  };
}