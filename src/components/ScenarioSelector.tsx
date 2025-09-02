'use client';

import React, { useState } from 'react';
import { scenarios, getScenariosByDifficulty } from '@/lib/scenarios';
import { Scenario } from '@/types/simulation';
import { useSimulation } from '@/hooks/use-simulation';
import { Play, Clock, DollarSign, Target, Star, BookOpen, Zap, Award } from 'lucide-react';

interface ScenarioSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: Scenario) => void;
}

const difficultyConfig = {
  beginner: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: BookOpen,
    label: 'Beginner'
  },
  intermediate: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Zap,
    label: 'Intermediate'
  },
  advanced: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Award,
    label: 'Advanced'
  }
};

function ScenarioCard({ scenario, onSelect }: { scenario: Scenario; onSelect: (scenario: Scenario) => void }) {
  const config = difficultyConfig[scenario.difficulty];
  const Icon = config.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium border ${config.color}`}>
              <Icon className="w-3 h-3" />
              <span>{config.label}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
          
          {/* Scenario Constraints */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
            {scenario.timeLimit && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{scenario.timeLimit} min</span>
              </div>
            )}
            {scenario.budget && (
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span>${scenario.budget.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{scenario.objectives.length} objectives</span>
            </div>
          </div>

          {/* Objectives Preview */}
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-900">Objectives:</h4>
            <ul className="space-y-1">
              {scenario.objectives.slice(0, 3).map(objective => (
                <li key={objective.id} className="text-xs text-gray-600 flex items-start space-x-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <span>{objective.description}</span>
                </li>
              ))}
              {scenario.objectives.length > 3 && (
                <li className="text-xs text-gray-500 italic">
                  +{scenario.objectives.length - 3} more objectives...
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelect(scenario)}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Play className="w-4 h-4" />
        <span>Start Scenario</span>
      </button>
    </div>
  );
}

export default function ScenarioSelector({ isOpen, onClose, onSelectScenario }: ScenarioSelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'all'>('all');

  if (!isOpen) return null;

  const filteredScenarios = selectedDifficulty === 'all' 
    ? scenarios 
    : getScenariosByDifficulty(selectedDifficulty);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Choose a Scenario</h2>
              <p className="text-sm text-gray-600 mt-1">
                Learn platform development through guided challenges
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Difficulty Filter */}
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-sm font-medium text-gray-700">Filter by difficulty:</span>
            <div className="flex space-x-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`
                    px-3 py-1 text-xs rounded-md transition-colors
                    ${selectedDifficulty === difficulty
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {difficulty === 'all' ? 'All' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {filteredScenarios.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scenarios found</h3>
              <p className="text-sm">Try selecting a different difficulty level.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScenarios.map(scenario => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onSelect={(scenario) => {
                    onSelectScenario(scenario);
                    onClose();
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              💡 Scenarios help you learn through hands-on experience with realistic challenges
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}