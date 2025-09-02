'use client';

import React from 'react';
import { DragStartEvent } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { ComponentType } from '@/types/simulation';
import { componentTemplates } from '@/lib/component-templates';
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
  BarChart3
} from 'lucide-react';
import { ELI5Tooltip } from './Tooltip';
import { getEducationalContent } from '@/lib/educational-content';

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

interface DraggableComponentProps {
  type: ComponentType;
  name: string;
  description: string;
  category: string;
}

function DraggableComponent({ type, name, description, category }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: type,
    data: { type, name, description }
  });

  const Icon = componentIcons[type];
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`
          bg-white border border-gray-200 rounded p-2 cursor-grab active:cursor-grabbing
          hover:shadow-sm transition-shadow duration-200 select-none
          ${isDragging ? 'opacity-50' : ''}
        `}
      >
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-gray-900 truncate">{name}</h3>
              <div className="w-4 h-4" /> {/* Spacer for ELI5 button */}
            </div>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{description}</p>
          </div>
        </div>
      </div>
      
      {/* ELI5 Tooltip positioned absolutely outside draggable area */}
      <div className="absolute top-2 right-2 z-10">
        <ELI5Tooltip
          concept={getEducationalContent(type)?.concept || name}
          explanation={getEducationalContent(type)?.explanation || description}
          analogy={getEducationalContent(type)?.analogy}
          learnMore={getEducationalContent(type)?.learnMore}
        />
      </div>
    </div>
  );
}

export default function ComponentPalette() {
  const categories = ['infrastructure', 'application', 'security', 'monitoring'] as const;
  
  const groupedComponents = categories.map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    components: componentTemplates.filter(template => template.category === category)
  }));

  return (
    <div className="h-full p-2 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Components</h2>
      
      <div className="space-y-4">
        {groupedComponents.map(group => (
          <div key={group.name}>
            <h3 className="text-xs font-medium text-gray-700 mb-2">{group.name}</h3>
            <div className="space-y-2">
              {group.components.map(template => (
                <DraggableComponent
                  key={template.type}
                  type={template.type}
                  name={template.name}
                  description={template.description}
                  category={template.category}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How to Use</h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          Drag components from this palette onto the platform canvas. Each component will 
          immediately affect your platform metrics. Configure components to optimize 
          performance, security, and reliability.
        </p>
      </div>
    </div>
  );
}