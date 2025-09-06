'use client';

import React from 'react';
import { usePlatform } from '@/hooks/use-platform';
import { Cpu, HardDrive, Activity, DollarSign, Server, Box, Layers, TrendingUp } from 'lucide-react';

export default function ResourceMetrics() {
  const { nodes, deployments, calculateGlobalMetrics } = usePlatform();
  
  // Debug log
  console.log('ResourceMetrics rendering, nodes:', nodes.size);
  const metrics = calculateGlobalMetrics();
  
  const cpuUtilization = metrics?.totalResources?.cpu > 0 
    ? (metrics.totalResources.allocatedCpu / metrics.totalResources.cpu) * 100 
    : 0;
    
  const memoryUtilization = metrics?.totalResources?.memory > 0
    ? (metrics.totalResources.allocatedMemory / metrics.totalResources.memory) * 100
    : 0;
    
  const storageUtilization = metrics?.totalResources?.storage > 0
    ? (metrics.totalResources.allocatedStorage / metrics.totalResources.storage) * 100
    : 0;
  
  const runningDeployments = deployments.filter(d => d.status === 'running').length;
  const nodeCount = nodes.size;
  
  // Add error boundary and null checks
  if (!metrics) {
    return (
      <div className="h-full p-3 overflow-y-auto">
        <div className="text-center text-gray-500">
          Loading metrics...
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full p-3 overflow-y-auto bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-gray-600" />
        <h2 className="text-sm font-semibold text-gray-900">Platform Metrics</h2>
      </div>
      
      {/* Resource Utilization */}
      <div className="space-y-3 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h3 className="text-xs font-medium text-gray-700 mb-2">Resource Utilization</h3>
          
          <div className="space-y-2">
            <ResourceBar
              icon={<Cpu className="w-3 h-3" />}
              label="CPU"
              used={metrics?.totalResources?.allocatedCpu || 0}
              total={metrics?.totalResources?.cpu || 0}
              utilization={cpuUtilization}
              unit="cores"
            />
            
            <ResourceBar
              icon={<Server className="w-3 h-3" />}
              label="Memory"
              used={metrics?.totalResources?.allocatedMemory || 0}
              total={metrics?.totalResources?.memory || 0}
              utilization={memoryUtilization}
              unit="GB"
              divisor={1024}
            />
            
            <ResourceBar
              icon={<HardDrive className="w-3 h-3" />}
              label="Storage"
              used={metrics?.totalResources?.allocatedStorage || 0}
              total={metrics?.totalResources?.storage || 0}
              utilization={storageUtilization}
              unit="GB"
              divisor={1024}
            />
          </div>
        </div>
      </div>
      
      {/* Platform Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatCard
          icon={<Box className="w-4 h-4 text-blue-600" />}
          label="Applications"
          value={metrics.applicationCount}
        />
        <StatCard
          icon={<Layers className="w-4 h-4 text-green-600" />}
          label="Deployments"
          value={runningDeployments}
        />
        <StatCard
          icon={<Server className="w-4 h-4 text-purple-600" />}
          label="Nodes"
          value={nodeCount}
        />
        <StatCard
          icon={<DollarSign className="w-4 h-4 text-yellow-600" />}
          label="Cost/mo"
          value={`$${metrics.totalCost}`}
        />
      </div>
      
      {/* Health Indicators */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <h3 className="text-xs font-medium text-gray-700 mb-2">Platform Health</h3>
        
        <div className="space-y-2">
          <HealthIndicator
            label="Service Health"
            value={metrics.serviceHealth}
            color={getHealthColor(metrics.serviceHealth)}
          />
          <HealthIndicator
            label="Platform Maturity"
            value={metrics.platformMaturity}
            color={getHealthColor(metrics.platformMaturity)}
          />
          <HealthIndicator
            label="Operational Excellence"
            value={metrics.operationalExcellence}
            color={getHealthColor(metrics.operationalExcellence)}
          />
        </div>
      </div>
      
      {/* Recommendations */}
      {getCostOptimizationTips(metrics).length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-yellow-600" />
            <h4 className="text-xs font-medium text-yellow-800">Optimization Tips</h4>
          </div>
          <ul className="text-xs text-yellow-700 space-y-1">
            {getCostOptimizationTips(metrics).map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface ResourceBarProps {
  icon: React.ReactNode;
  label: string;
  used: number;
  total: number;
  utilization: number;
  unit: string;
  divisor?: number;
}

function ResourceBar({ icon, label, used, total, utilization, unit, divisor = 1 }: ResourceBarProps) {
  const getUtilizationColor = (percent: number) => {
    if (percent > 90) return 'bg-red-500';
    if (percent > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-1">
          {icon}
          <span className="text-gray-600">{label}</span>
        </div>
        <span className="text-gray-700">
          {(used / divisor).toFixed(1)}/{(total / divisor).toFixed(1)} {unit}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${getUtilizationColor(utilization)}`}
          style={{ width: `${Math.min(100, utilization)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {utilization.toFixed(1)}% utilized
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <div className="text-xs text-gray-500">{label}</div>
          <div className="text-sm font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
}

interface HealthIndicatorProps {
  label: string;
  value: number;
  color: string;
}

function HealthIndicator({ label, value, color }: HealthIndicatorProps) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function getHealthColor(value: number): string {
  if (value >= 80) return 'bg-green-500';
  if (value >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getCostOptimizationTips(metrics: any): string[] {
  const tips: string[] = [];
  
  if (metrics.totalResources.allocatedCpu / metrics.totalResources.cpu < 0.3) {
    tips.push('CPU utilization is low - consider smaller instances');
  }
  
  if (metrics.totalResources.allocatedMemory / metrics.totalResources.memory < 0.3) {
    tips.push('Memory utilization is low - optimize resource allocation');
  }
  
  if (metrics.applicationCount === 0 && metrics.totalCost > 0) {
    tips.push('No applications deployed - platform resources are idle');
  }
  
  if (metrics.serviceHealth < 80) {
    tips.push('Service health is degraded - check failing components');
  }
  
  return tips.slice(0, 3);
}