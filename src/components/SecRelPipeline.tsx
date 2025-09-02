'use client';

import React, { useState } from 'react';
import { useSimulation } from '@/hooks/use-simulation';
import { CheckpointType, SecRelCheckpoint, IssueSeverity } from '@/types/simulation';
import { 
  Shield, 
  Code, 
  FileCheck, 
  Activity, 
  Users, 
  Scale,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ELI5Tooltip } from './Tooltip';
import { getEducationalContent } from '@/lib/educational-content';

const checkpointIcons = {
  [CheckpointType.SECURITY_REVIEW]: Shield,
  [CheckpointType.ENGINEERING_REVIEW]: Code,
  [CheckpointType.COMPLIANCE_CHECK]: FileCheck,
  [CheckpointType.RELIABILITY_TEST]: Activity,
  [CheckpointType.ETHICS_REVIEW]: Users,
  [CheckpointType.LEGAL_REVIEW]: Scale
};

const checkpointColors = {
  [CheckpointType.SECURITY_REVIEW]: 'text-red-600 bg-red-100',
  [CheckpointType.ENGINEERING_REVIEW]: 'text-blue-600 bg-blue-100',
  [CheckpointType.COMPLIANCE_CHECK]: 'text-yellow-600 bg-yellow-100',
  [CheckpointType.RELIABILITY_TEST]: 'text-purple-600 bg-purple-100',
  [CheckpointType.ETHICS_REVIEW]: 'text-green-600 bg-green-100',
  [CheckpointType.LEGAL_REVIEW]: 'text-indigo-600 bg-indigo-100'
};

interface CheckpointCardProps {
  checkpoint: SecRelCheckpoint;
  onRunCheck: (checkpointId: string) => void;
  isRunning: boolean;
}

function CheckpointCard({ checkpoint, onRunCheck, isRunning }: CheckpointCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = checkpointIcons[checkpoint.type];
  const colors = checkpointColors[checkpoint.type];
  
  const getStatusIcon = () => {
    if (isRunning) return <Clock className="w-3 h-3 text-yellow-500 animate-spin" />;
    if (checkpoint.passed) return <CheckCircle className="w-3 h-3 text-green-500" />;
    return <XCircle className="w-3 h-3 text-red-500" />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded ${colors}`}>
            <Icon className="w-3 h-3" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-medium text-gray-900 truncate">{checkpoint.name}</h3>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className={`text-xs ${checkpoint.passed ? 'text-green-600' : 'text-red-600'}`}>
                {checkpoint.passed ? 'Pass' : 'Fail'}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onRunCheck(checkpoint.id)}
          disabled={isRunning}
          className={`
            px-2 py-1 text-xs rounded transition-colors
            ${isRunning 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {isRunning ? 'Run...' : 'Check'}
        </button>
      </div>
    </div>
  );
}

export default function SecRelPipeline() {
  const { components, secrelCheckpoints, engine } = useSimulation();
  const [runningChecks, setRunningChecks] = useState<Set<string>>(new Set());

  // Generate checkpoints for all components
  const allCheckpoints = React.useMemo(() => {
    const checkpoints: SecRelCheckpoint[] = [];
    
    components.forEach(component => {
      Object.values(CheckpointType).forEach(type => {
        const existing = secrelCheckpoints.find(
          cp => cp.type === type && cp.name.includes(component.name)
        );
        
        if (!existing) {
          const checkpoint = engine.createSecRelCheckpoint(type, component);
          checkpoint.name = `${checkpoint.name} - ${component.name}`;
          checkpoints.push(checkpoint);
        }
      });
    });

    return [...secrelCheckpoints, ...checkpoints];
  }, [components, secrelCheckpoints, engine]);

  const handleRunCheck = async (checkpointId: string) => {
    setRunningChecks(prev => new Set(prev).add(checkpointId));
    
    // Simulate check execution time
    setTimeout(() => {
      setRunningChecks(prev => {
        const newSet = new Set(prev);
        newSet.delete(checkpointId);
        return newSet;
      });
      
      // Re-evaluate checkpoint (in a real system, this would trigger actual tests)
      const checkpoint = allCheckpoints.find(cp => cp.id === checkpointId);
      if (checkpoint) {
        // Randomly pass/fail for simulation purposes
        checkpoint.passed = Math.random() > 0.3;
      }
    }, 2000);
  };

  const passedChecks = allCheckpoints.filter(cp => cp.passed).length;
  const totalChecks = allCheckpoints.length;
  const passRate = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 100;

  const getPassRateColor = () => {
    if (passRate >= 90) return 'text-green-600';
    if (passRate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-semibold text-gray-900">SecRel Pipeline</h2>
          <ELI5Tooltip
            concept={getEducationalContent('secrelPipeline')?.concept || 'SecRel Pipeline'}
            explanation={getEducationalContent('secrelPipeline')?.explanation || 'A quality control system for your platform'}
            analogy={getEducationalContent('secrelPipeline')?.analogy}
            learnMore={getEducationalContent('secrelPipeline')?.learnMore}
          />
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-bold ${getPassRateColor()}`}>
            {Math.round(passRate)}%
          </div>
          <div className="text-xs text-gray-500">
            {passedChecks}/{totalChecks}
          </div>
        </div>
      </div>

      {/* Pipeline Status */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${
              passRate >= 90 ? 'bg-green-500' :
              passRate >= 70 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${passRate}%` }}
          />
        </div>
      </div>

      {/* Checkpoints by Category */}
      <div className="space-y-2">
        {Object.values(CheckpointType).map(type => {
          const typeCheckpoints = allCheckpoints.filter(cp => cp.type === type);
          if (typeCheckpoints.length === 0) return null;

          const typePassed = typeCheckpoints.filter(cp => cp.passed).length;
          
          return (
            <div key={type} className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-gray-900 capitalize">
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <span className="text-xs text-gray-500">
                  {typePassed}/{typeCheckpoints.length}
                </span>
              </div>
              
              <div className="space-y-1">
                {typeCheckpoints.map(checkpoint => (
                  <CheckpointCard
                    key={checkpoint.id}
                    checkpoint={checkpoint}
                    onRunCheck={handleRunCheck}
                    isRunning={runningChecks.has(checkpoint.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {components.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs">
            Add components to see SecRel checks
          </p>
        </div>
      )}
    </div>
  );
}