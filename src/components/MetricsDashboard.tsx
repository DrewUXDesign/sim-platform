'use client';

import React from 'react';
import { useSimulation } from '@/hooks/use-simulation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  Zap, 
  Shield, 
  Code, 
  TrendingUp, 
  DollarSign,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { ELI5Tooltip } from './Tooltip';
import { getEducationalContent } from '@/lib/educational-content';

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
  educationalKey?: string;
}

function MetricCard({ title, value, unit = '', icon, color, description, trend, educationalKey }: MetricCardProps) {
  const getValueColor = () => {
    if (title.includes('Debt') || title.includes('Cost')) {
      // For negative metrics, lower is better
      if (value <= 30) return 'text-green-600';
      if (value <= 60) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      // For positive metrics, higher is better
      if (value >= 80) return 'text-green-600';
      if (value >= 60) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
    return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-md ${color}`}>
          {icon}
        </div>
        {getTrendIcon()}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        <div className={`text-2xl font-bold ${getValueColor()}`}>
          {typeof value === 'number' ? Math.round(value) : value}{unit}
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
      </div>
      
      {/* ELI5 Tooltip positioned absolutely */}
      {educationalKey && (
        <div className="absolute top-2 right-2 z-10">
          <ELI5Tooltip
            concept={getEducationalContent(educationalKey)?.concept || title}
            explanation={getEducationalContent(educationalKey)?.explanation || description}
            analogy={getEducationalContent(educationalKey)?.analogy}
            learnMore={getEducationalContent(educationalKey)?.learnMore}
          />
        </div>
      )}
    </div>
  );
}

export default function MetricsDashboard() {
  const { metrics, issues, components } = useSimulation();

  const metricsData = [
    {
      name: 'Performance',
      value: metrics.performanceScore,
      color: '#3B82F6'
    },
    {
      name: 'Security',
      value: metrics.securityScore,
      color: '#10B981'
    },
    {
      name: 'User Satisfaction',
      value: metrics.userSatisfaction,
      color: '#8B5CF6'
    },
    {
      name: 'Developer Velocity',
      value: metrics.developerVelocity,
      color: '#F59E0B'
    }
  ];

  const issuesBySeverity = {
    critical: issues.filter(i => i.severity === 'critical').length,
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    low: issues.filter(i => i.severity === 'low').length
  };

  const issuesChartData = [
    { name: 'Critical', value: issuesBySeverity.critical, color: '#EF4444' },
    { name: 'High', value: issuesBySeverity.high, color: '#F97316' },
    { name: 'Medium', value: issuesBySeverity.medium, color: '#EAB308' },
    { name: 'Low', value: issuesBySeverity.low, color: '#22C55E' }
  ];

  return (
    <div className="h-full p-2 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Metrics</h2>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-2 mb-4">
        <MetricCard
          title="User Satisfaction"
          value={metrics.userSatisfaction}
          unit="%"
          icon={<Users className="w-4 h-4 text-white" />}
          color="bg-purple-500"
          description="How satisfied users are with platform performance and features"
          educationalKey="userSatisfaction"
        />
        
        <MetricCard
          title="Developer Velocity"
          value={metrics.developerVelocity}
          unit="%"
          icon={<Zap className="w-4 h-4 text-white" />}
          color="bg-blue-500"
          description="How quickly developers can ship new features"
          educationalKey="developerVelocity"
        />
        
        <MetricCard
          title="Security Score"
          value={metrics.securityScore}
          unit="%"
          icon={<Shield className="w-4 h-4 text-white" />}
          color="bg-green-500"
          description="Overall security posture of the platform"
          educationalKey="securityScore"
        />
        
        <MetricCard
          title="Technical Debt"
          value={metrics.technicalDebt}
          unit="%"
          icon={<Code className="w-4 h-4 text-white" />}
          color="bg-red-500"
          description="Accumulated shortcuts and compromises in the codebase"
          educationalKey="technicalDebt"
        />
        
        <MetricCard
          title="Adoption Rate"
          value={metrics.adoptionRate}
          unit="%"
          icon={<TrendingUp className="w-4 h-4 text-white" />}
          color="bg-indigo-500"
          description="Rate at which users are adopting platform features"
        />
        
        <MetricCard
          title="Monthly Cost"
          value={metrics.totalCost}
          unit=""
          icon={<DollarSign className="w-4 h-4 text-white" />}
          color="bg-yellow-500"
          description="Total monthly operational costs"
        />
        
        <MetricCard
          title="Time to Market"
          value={metrics.timeToMarket}
          unit=" days"
          icon={<Clock className="w-4 h-4 text-white" />}
          color="bg-orange-500"
          description="Average time to deliver new features"
        />
      </div>

      {/* Performance Metrics Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Platform Health</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Score']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Issues Breakdown */}
      {issues.length > 0 && (
        <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            Active Issues ({issues.length})
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={issuesChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" fontSize={12} width={60} />
              <Tooltip
                formatter={(value: number) => [value, 'Issues']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Component Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Platform Overview</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Components</span>
            <span className="font-medium">{components.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Active Issues</span>
            <span className={`font-medium ${issues.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {issues.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Health Score</span>
            <span className="font-medium text-blue-600">
              {components.length > 0 
                ? Math.round(components.reduce((sum, c) => 
                    sum + (c.metrics.performance + c.metrics.security + c.metrics.reliability) / 3, 0
                  ) / components.length)
                : 0
              }%
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Indicator */}
      <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Real-time metrics</span>
        </div>
      </div>
    </div>
  );
}