'use client';

import React from 'react';
import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import { PlatformNode as PlatformNodeType, ComponentLayer } from '@/types/platform';
import { getNodeTemplate, NodeTemplate } from '@/lib/platform-templates';
import {
  Server, Database, Globe, Network, HardDrive, Box, GitBranch, Grid,
  MessageSquare, Package, Shield, Activity, List, Zap, Layout, Code,
  Cpu, Clock, Settings
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Globe, Server, Network, HardDrive, Box, GitBranch, Grid,
  MessageSquare, Package, Shield, Activity, List, Database,
  Zap, Layout, Code, Cpu, Clock, Settings
};

interface DragOverlayProps {
  activeId: string | null;
  activeNode?: PlatformNodeType | null;
  activeTemplate?: NodeTemplate | null;
}

export default function DragOverlay({ activeId, activeNode, activeTemplate }: DragOverlayProps) {
  if (!activeId) return null;

  const layerColors = {
    [ComponentLayer.INFRASTRUCTURE]: 'border-purple-400 bg-purple-50',
    [ComponentLayer.PLATFORM]: 'border-blue-400 bg-blue-50',
    [ComponentLayer.SERVICE]: 'border-green-400 bg-green-50',
    [ComponentLayer.APPLICATION]: 'border-yellow-400 bg-yellow-50'
  };

  // Render existing node being dragged
  if (activeNode) {
    const template = getNodeTemplate(activeNode.type);
    const Icon = iconMap[template?.icon || 'Settings'];
    
    return (
      <DndDragOverlay>
        <div
          className={`
            rounded-lg border-2 shadow-2xl cursor-grabbing
            ${layerColors[activeNode.layer]}
            opacity-90
          `}
          style={{
            width: activeNode.size?.width || 150,
            height: activeNode.size?.height || 100,
          }}
        >
          <div className="flex items-center justify-between p-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium truncate">{activeNode.name}</span>
            </div>
          </div>
        </div>
      </DndDragOverlay>
    );
  }

  // Render template being dragged from palette
  if (activeTemplate) {
    const Icon = iconMap[activeTemplate.icon] || Settings;
    
    return (
      <DndDragOverlay>
        <div
          className={`
            rounded-lg border-2 shadow-2xl cursor-grabbing p-3
            ${layerColors[activeTemplate.layer]}
            opacity-90
          `}
          style={{
            width: 200,
            height: 80,
          }}
        >
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <div>
              <div className="text-sm font-semibold">{activeTemplate.name}</div>
              <div className="text-xs opacity-75">{activeTemplate.description}</div>
            </div>
          </div>
        </div>
      </DndDragOverlay>
    );
  }

  return null;
}