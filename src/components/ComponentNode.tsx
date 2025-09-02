'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PlatformComponent, ComponentType } from '@/types/simulation';
import { 
  Server, 
  Database, 
  Zap, 
  Shield, 
  Monitor, 
  Globe, 
  MessageSquare, 
  Package, 
  Layout,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const componentIcons = {
  [ComponentType.API]: Server,
  [ComponentType.DATABASE]: Database,
  [ComponentType.LOAD_BALANCER]: Zap,
  [ComponentType.CACHE]: BarChart3,
  [ComponentType.AUTH_SERVICE]: Shield,
  [ComponentType.MONITORING]: Monitor,
  [ComponentType.CDN]: Globe,
  [ComponentType.QUEUE]: MessageSquare,
  [ComponentType.MICROSERVICE]: Package,
  [ComponentType.FRONTEND]: Layout
};

interface ComponentNodeProps {
  component: PlatformComponent;
  onClick: () => void;
  onPositionChange: (componentId: string, position: { x: number; y: number }) => void;
  onConnectionStart: (componentId: string) => void;
  isConnecting: boolean;
  connectingFrom: string | null;
}

export default function ComponentNode({ component, onClick, onPositionChange, onConnectionStart, isConnecting, connectingFrom }: ComponentNodeProps) {
  const Icon = componentIcons[component.type];
  const hasIssues = component.issues.length > 0;
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${component.id}`,
    data: { 
      type: 'component',
      component: component
    }
  });

  // Calculate overall health score
  const healthScore = Math.round(
    (component.metrics.performance + component.metrics.security + component.metrics.reliability) / 3
  );

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.8 : 1
  } : undefined;

  const handleConnectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConnectionStart(component.id);
  };

  return (
    <div
      className={`
        absolute select-none transition-transform duration-200 hover:scale-105
        ${getHealthBgColor(healthScore)}
        ${isDragging ? 'z-50' : 'z-10'}
        ${isConnecting ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
        ${connectingFrom && connectingFrom !== component.id ? 'ring-2 ring-green-400 ring-offset-2' : ''}
      `}
      style={{
        left: component.position.x,
        top: component.position.y,
        width: '120px',
        height: '80px',
        ...style
      }}
    >
      {/* Main Component Box */}
      <div 
        className="w-full h-full border-2 rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseDown={(e) => {
          // Allow dragging on the main component body
          e.stopPropagation();
        }}
      >
        {/* Header with Icon and Issues */}
        <div className="flex items-center justify-between mb-1">
          <Icon className={`w-4 h-4 ${getHealthColor(healthScore)}`} />
          {hasIssues && (
            <AlertTriangle className="w-3 h-3 text-red-500" />
          )}
          {!hasIssues && healthScore >= 80 && (
            <CheckCircle className="w-3 h-3 text-green-500" />
          )}
        </div>

        {/* Component Name with Drag Handle */}
        <div 
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className="text-xs font-medium text-gray-900 truncate mb-1 cursor-grab active:cursor-grabbing flex items-center space-x-1 py-1 px-1 rounded hover:bg-gray-50"
          title="Drag to move component"
        >
          <span className="text-gray-400">⋮⋮</span>
          <span>{component.name}</span>
        </div>

        {/* Health Score */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Health</span>
          <span className={`font-medium ${getHealthColor(healthScore)}`}>
            {healthScore}%
          </span>
        </div>

        {/* Metrics Bar */}
        <div className="flex space-x-1 mt-1">
          <div 
            className="h-1 bg-blue-400 rounded-full" 
            style={{ width: `${component.metrics.performance * 0.3}px` }}
            title={`Performance: ${component.metrics.performance}%`}
          />
          <div 
            className="h-1 bg-green-400 rounded-full" 
            style={{ width: `${component.metrics.security * 0.3}px` }}
            title={`Security: ${component.metrics.security}%`}
          />
          <div 
            className="h-1 bg-purple-400 rounded-full" 
            style={{ width: `${component.metrics.reliability * 0.3}px` }}
            title={`Reliability: ${component.metrics.reliability}%`}
          />
        </div>

        {/* Issues Badge */}
        {hasIssues && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {component.issues.length}
          </div>
        )}
      </div>

      {/* Connection Points */}
      <div 
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm hover:bg-blue-600 cursor-pointer z-20" 
        onClick={handleConnectionClick}
        title="Connect to other components"
      />
      <div 
        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm hover:bg-blue-600 cursor-pointer z-20" 
        onClick={handleConnectionClick}
        title="Connect to other components"
      />
      <div 
        className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm hover:bg-blue-600 cursor-pointer z-20" 
        onClick={handleConnectionClick}
        title="Connect to other components"
      />
      <div 
        className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm hover:bg-blue-600 cursor-pointer z-20" 
        onClick={handleConnectionClick}
        title="Connect to other components"
      />
    </div>
  );
}