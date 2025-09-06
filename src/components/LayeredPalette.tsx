'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ComponentLayer } from '@/types/platform';
import { getTemplatesByLayer, NodeTemplate } from '@/lib/platform-templates';
import { usePlatform } from '@/hooks/use-platform';
import {
  Server, Database, Globe, Network, HardDrive, Box, GitBranch, Grid,
  MessageSquare, Package, Shield, Activity, List, Zap, Layout, Code,
  Cpu, Clock, Settings, ChevronRight, ChevronDown, Layers
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Globe, Server, Network, HardDrive, Box, GitBranch, Grid,
  MessageSquare, Package, Shield, Activity, List, Database,
  Zap, Layout, Code, Cpu, Clock, Settings
};

interface DraggableNodeProps {
  template: NodeTemplate;
}

function DraggableNode({ template }: DraggableNodeProps) {
  const { setDraggedNodeType } = usePlatform();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${template.type}`,
    data: { type: template.type, template }
  });
  
  const Icon = iconMap[template.icon] || Settings;
  
  const layerColors = {
    [ComponentLayer.INFRASTRUCTURE]: 'border-purple-300 bg-purple-50 text-purple-800',
    [ComponentLayer.PLATFORM]: 'border-blue-300 bg-blue-50 text-blue-800',
    [ComponentLayer.SERVICE]: 'border-green-300 bg-green-50 text-green-800',
    [ComponentLayer.APPLICATION]: 'border-yellow-300 bg-yellow-50 text-yellow-800'
  };
  
  React.useEffect(() => {
    setDraggedNodeType(isDragging ? template.type : null);
  }, [isDragging, template.type, setDraggedNodeType]);
  
  return (
    <div
      ref={setNodeRef}
      {...(mounted ? attributes : {})}
      {...(mounted ? listeners : {})}
      className={`
        border rounded-lg p-2 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-shadow select-none
        ${layerColors[template.layer]}
        ${isDragging ? 'opacity-40' : ''}
      `}
      title={template.description}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate">{template.name}</div>
          <div className="text-xs text-gray-700 truncate">{template.description}</div>
        </div>
      </div>
      {template.resources && (
        <div className="mt-1 flex gap-2 text-xs text-gray-600">
          {template.resources.cpu && <span className="font-medium">CPU: {template.resources.cpu}</span>}
          {template.resources.memory && <span className="font-medium">Mem: {template.resources.memory}MB</span>}
        </div>
      )}
      <div className="mt-1 text-xs text-gray-600 font-medium">
        Cost: ${template.baseCost}/mo
      </div>
    </div>
  );
}

interface LayerSectionProps {
  layer: ComponentLayer;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function LayerSection({ layer, title, description, icon }: LayerSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const templates = getTemplatesByLayer(layer);
  
  const layerColors = {
    [ComponentLayer.INFRASTRUCTURE]: 'bg-purple-50 border-purple-400',
    [ComponentLayer.PLATFORM]: 'bg-blue-50 border-blue-400',
    [ComponentLayer.SERVICE]: 'bg-green-50 border-green-400',
    [ComponentLayer.APPLICATION]: 'bg-yellow-50 border-yellow-400'
  };
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center gap-2 p-2 rounded-lg border
          ${layerColors[layer]} hover:opacity-90 transition-opacity
        `}
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {icon}
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-gray-800">{title}</div>
          <div className="text-xs text-gray-700">{description}</div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-2 space-y-2 pl-6">
          {templates.map(template => (
            <DraggableNode key={template.type} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LayeredPalette() {
  return (
    <div className="h-full p-3 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-gray-600" />
        <h2 className="text-sm font-semibold text-gray-900">Platform Components</h2>
      </div>
      
      <div className="space-y-2">
        <LayerSection
          layer={ComponentLayer.INFRASTRUCTURE}
          title="Infrastructure"
          description="Physical and virtual resources"
          icon={<Server className="w-4 h-4" />}
        />
        
        <LayerSection
          layer={ComponentLayer.PLATFORM}
          title="Platform Services"
          description="Container orchestration & management"
          icon={<Box className="w-4 h-4" />}
        />
        
        <LayerSection
          layer={ComponentLayer.SERVICE}
          title="Runtime Services"
          description="Databases, caches, queues"
          icon={<Database className="w-4 h-4" />}
        />
        
        <LayerSection
          layer={ComponentLayer.APPLICATION}
          title="Applications"
          description="Your apps and services"
          icon={<Layout className="w-4 h-4" />}
        />
      </div>
      
      <div className="mt-6 p-3 bg-gray-100 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 mb-2">How to Build</h4>
        <ol className="text-xs text-gray-600 space-y-1">
          <li>1. Start with Infrastructure (regions, compute)</li>
          <li>2. Add Platform services (Kubernetes, API Gateway)</li>
          <li>3. Deploy Runtime services (databases, caches)</li>
          <li>4. Drop Applications into containers</li>
        </ol>
      </div>
    </div>
  );
}