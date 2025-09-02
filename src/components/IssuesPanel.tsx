'use client';

import React, { useState } from 'react';
import { useSimulation } from '@/hooks/use-simulation';
import { Issue, IssueSeverity, IssueType } from '@/types/simulation';
import { 
  AlertTriangle, 
  AlertCircle, 
  AlertOctagon, 
  Info,
  Clock,
  DollarSign,
  CheckCircle,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const severityConfig = {
  [IssueSeverity.CRITICAL]: {
    icon: AlertOctagon,
    color: 'text-red-700 bg-red-100 border-red-300',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50'
  },
  [IssueSeverity.HIGH]: {
    icon: AlertTriangle,
    color: 'text-orange-700 bg-orange-100 border-orange-300',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50'
  },
  [IssueSeverity.MEDIUM]: {
    icon: AlertCircle,
    color: 'text-yellow-700 bg-yellow-100 border-yellow-300',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50'
  },
  [IssueSeverity.LOW]: {
    icon: Info,
    color: 'text-blue-700 bg-blue-100 border-blue-300',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50'
  }
};

const typeConfig = {
  [IssueType.SECURITY]: 'Security',
  [IssueType.PERFORMANCE]: 'Performance',
  [IssueType.RELIABILITY]: 'Reliability',
  [IssueType.COMPLIANCE]: 'Compliance',
  [IssueType.SCALABILITY]: 'Scalability',
  [IssueType.TECHNICAL_DEBT]: 'Technical Debt'
};

interface IssueCardProps {
  issue: Issue;
  onResolve: (issueId: string) => void;
  isResolving: boolean;
}

function IssueCard({ issue, onResolve, isResolving }: IssueCardProps) {
  const config = severityConfig[issue.severity];
  const Icon = config.icon;

  return (
    <div className={`border rounded p-2 ${config.bgColor} border-opacity-50`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          <div className={`p-1 rounded ${config.color}`}>
            <Icon className="w-3 h-3" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-xs font-medium ${config.textColor} truncate`}>
              {issue.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
              <span>{issue.timeToResolve}h</span>
              <span>${issue.cost.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onResolve(issue.id)}
          disabled={isResolving}
          className={`
            text-xs px-2 py-1 rounded transition-colors ml-2
            ${isResolving
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
            }
          `}
        >
          {isResolving ? 'Fix...' : 'Fix'}
        </button>
      </div>
    </div>
  );
}

function getResolutionStrategy(issue: Issue): string {
  switch (issue.type) {
    case IssueType.SECURITY:
      return "Implement security review process, add encryption, enable authentication, and conduct vulnerability assessment.";
    case IssueType.PERFORMANCE:
      return "Enable caching, add compression, implement load balancing, and optimize queries for better response times.";
    case IssueType.RELIABILITY:
      return "Add health checks, implement monitoring, set up backups, and improve error handling mechanisms.";
    case IssueType.COMPLIANCE:
      return "Review compliance requirements, update privacy policies, implement audit trails, and ensure regulatory adherence.";
    case IssueType.SCALABILITY:
      return "Implement horizontal scaling, add load balancing, optimize resource utilization, and plan capacity growth.";
    case IssueType.TECHNICAL_DEBT:
      return "Refactor legacy code, improve documentation, add unit tests, and modernize deprecated dependencies.";
    default:
      return "Analyze root cause, implement appropriate fixes, and establish monitoring to prevent recurrence.";
  }
}

export default function IssuesPanel() {
  const { issues, resolveIssue } = useSimulation();
  const [resolvingIssues, setResolvingIssues] = useState<Set<string>>(new Set());

  const handleResolveIssue = async (issueId: string) => {
    setResolvingIssues(prev => new Set(prev).add(issueId));
    
    // Simulate resolution time
    setTimeout(() => {
      resolveIssue(issueId);
      setResolvingIssues(prev => {
        const newSet = new Set(prev);
        newSet.delete(issueId);
        return newSet;
      });
    }, 1500);
  };

  const groupedIssues = {
    [IssueSeverity.CRITICAL]: issues.filter(i => i.severity === IssueSeverity.CRITICAL),
    [IssueSeverity.HIGH]: issues.filter(i => i.severity === IssueSeverity.HIGH),
    [IssueSeverity.MEDIUM]: issues.filter(i => i.severity === IssueSeverity.MEDIUM),
    [IssueSeverity.LOW]: issues.filter(i => i.severity === IssueSeverity.LOW)
  };

  const totalIssues = issues.length;
  const totalResolutionTime = issues.reduce((sum, issue) => sum + issue.timeToResolve, 0);
  const totalResolutionCost = issues.reduce((sum, issue) => sum + issue.cost, 0);

  if (totalIssues === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-xs">No active issues</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-900">Active Issues ({totalIssues})</h2>
        <div className="text-xs text-gray-500">
          {Math.round(totalResolutionTime)}h • ${totalResolutionCost.toLocaleString()}
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-2">
        {Object.entries(groupedIssues).map(([severity, severityIssues]) => {
          if (severityIssues.length === 0) return null;
          
          return (
            <div key={severity} className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className={`text-xs font-medium ${severityConfig[severity as IssueSeverity].textColor} uppercase`}>
                  {severity}
                </h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                  {severityIssues.length}
                </span>
              </div>
              
              <div className="space-y-1">
                {severityIssues.map(issue => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onResolve={handleResolveIssue}
                    isResolving={resolvingIssues.has(issue.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}