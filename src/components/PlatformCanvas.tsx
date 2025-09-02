'use client';

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSimulation } from '@/hooks/use-simulation';
import { PlatformComponent, ComponentType } from '@/types/simulation';
import { getComponentTemplate } from '@/lib/component-templates';
import ComponentNode from './ComponentNode';
import ComponentConfigModal from './ComponentConfigModal';
import ConnectionLines from './ConnectionLines';

export default function PlatformCanvas() {
  const { components, addComponent, updateComponent, removeComponent } = useSimulation();
  const [selectedComponent, setSelectedComponent] = useState<PlatformComponent | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas'
  });

  const handleDrop = (event: any) => {
    const { active } = event;
    const componentType = active.id as ComponentType;
    const template = getComponentTemplate(componentType);
    
    if (!template) return;

    // Calculate drop position relative to canvas
    const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
    const dropX = canvasRect ? event.activatorEvent.clientX - canvasRect.left : 200;
    const dropY = canvasRect ? event.activatorEvent.clientY - canvasRect.top : 200;

    const newComponent: PlatformComponent = {
      id: Math.random().toString(36).substr(2, 9),
      type: componentType,
      name: template.name,
      position: { 
        x: Math.max(0, Math.min(dropX - 60, 800)), // Keep within bounds
        y: Math.max(0, Math.min(dropY - 40, 600))
      },
      config: { ...template.defaultConfig },
      connections: [],
      issues: [],
      metrics: { ...template.baseMetrics }
    };

    addComponent(newComponent);
  };

  const handleComponentClick = (component: PlatformComponent) => {
    setSelectedComponent(component);
    setConfigModalOpen(true);
  };

  const handleConfigSave = (updatedComponent: PlatformComponent) => {
    updateComponent(updatedComponent.id, updatedComponent);
    setConfigModalOpen(false);
    setSelectedComponent(null);
  };

  const handleComponentDelete = (componentId: string) => {
    removeComponent(componentId);
    setConfigModalOpen(false);
    setSelectedComponent(null);
  };

  const handlePositionChange = (componentId: string, position: { x: number; y: number }) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      updateComponent(componentId, {
        ...component,
        position
      });
    }
  };

  const handleConnectionStart = (componentId: string) => {
    if (connectingFrom === componentId) {
      // Cancel connection if clicking the same component
      setConnectingFrom(null);
    } else if (connectingFrom) {
      // Complete connection
      const fromComponent = components.find(c => c.id === connectingFrom);
      const toComponent = components.find(c => c.id === componentId);
      
      if (fromComponent && toComponent && fromComponent.id !== toComponent.id) {
        // Add connection to both components
        const updatedFromComponent = {
          ...fromComponent,
          connections: [...fromComponent.connections, toComponent.id]
        };
        
        updateComponent(connectingFrom, updatedFromComponent);
      }
      
      setConnectingFrom(null);
    } else {
      // Start new connection
      setConnectingFrom(componentId);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        id="canvas"
        className={`
          flex-1 relative bg-white border border-gray-200 m-2 rounded-lg overflow-hidden
          ${isOver ? 'bg-blue-50 border-blue-300' : ''}
        `}
        style={{ minHeight: '400px' }}
      >
        {/* Simple Grid Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ccc 1px, transparent 1px),
              linear-gradient(to bottom, #ccc 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Drop Zone Indicator */}
        {isOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-50">
            <div className="text-blue-600 text-lg font-medium">
              Drop component here
            </div>
          </div>
        )}

        {/* Connection Mode Indicator */}
        {connectingFrom && (
          <div className="absolute top-4 left-4 bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-800">
                Connection Mode: Click another component to connect
              </span>
            </div>
            <button
              onClick={() => setConnectingFrom(null)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Cancel Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {components.length === 0 && !isOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">Platform Canvas</div>
              <div className="text-sm">
                Drag components from the palette to start building your platform
              </div>
            </div>
          </div>
        )}

        {/* Connection Lines */}
        <ConnectionLines components={components} />

        {/* Render Components */}
        {components.map(component => (
          <ComponentNode
            key={component.id}
            component={component}
            onClick={() => handleComponentClick(component)}
            onPositionChange={handlePositionChange}
            onConnectionStart={handleConnectionStart}
            isConnecting={connectingFrom === component.id}
            connectingFrom={connectingFrom}
          />
        ))}
      </div>

      {/* Component Configuration Modal */}
      {selectedComponent && (
        <ComponentConfigModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          component={selectedComponent}
          onSave={handleConfigSave}
          onDelete={handleComponentDelete}
        />
      )}
    </>
  );
}