'use client';

import React from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import ComponentPalette from '@/components/ComponentPalette';
import PlatformCanvas from '@/components/PlatformCanvas';
import MetricsDashboard from '@/components/MetricsDashboard';
import SecRelPipeline from '@/components/SecRelPipeline';
import IssuesPanel from '@/components/IssuesPanel';
import ScenarioSelector from '@/components/ScenarioSelector';
import { useSimulation } from '@/hooks/use-simulation';
import { ComponentType } from '@/types/simulation';
import { getComponentTemplate } from '@/lib/component-templates';
import { Play, Pause, RotateCcw, BookOpen, Target } from 'lucide-react';
import ResizablePane, { ResizableBottomPane } from '@/components/ResizablePane';

export default function HomePage() {
  const [scenarioSelectorOpen, setScenarioSelectorOpen] = React.useState(false);
  
  const { 
    isRunning, 
    simulationSpeed, 
    totalTime,
    currentScenario,
    components,
    startSimulation, 
    pauseSimulation, 
    setSpeed,
    addComponent,
    updateComponent,
    loadScenario,
    clearScenario
  } = useSimulation();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    // Check if we're dragging an existing component
    if (active.id.toString().startsWith('component-')) {
      const componentId = active.id.toString().replace('component-', '');
      const component = components.find(c => c.id === componentId);
      
      if (component && delta) {
        const newPosition = {
          x: Math.max(0, Math.min(component.position.x + delta.x, 700)),
          y: Math.max(0, Math.min(component.position.y + delta.y, 500))
        };
        
        console.log('Updating component position:', componentId, 'from', component.position, 'to', newPosition);
        
        updateComponent(componentId, {
          position: newPosition
        });
      }
      return;
    }

    // Handle dropping new components from palette
    if (over && over.id === 'canvas') {
      const componentType = active.id as ComponentType;
      const template = getComponentTemplate(componentType);
      
      if (template) {
        // Calculate drop position relative to canvas
        const canvasElement = document.getElementById('canvas');
        const canvasRect = canvasElement?.getBoundingClientRect();
        
        let dropX = 200;
        let dropY = 200;
        
        if (canvasRect && event.activatorEvent) {
          dropX = event.activatorEvent.clientX - canvasRect.left;
          dropY = event.activatorEvent.clientY - canvasRect.top;
        }

        const newComponent = {
          id: Math.random().toString(36).substr(2, 9),
          type: componentType,
          name: template.name,
          position: { 
            x: Math.max(0, Math.min(dropX - 60, 800)),
            y: Math.max(0, Math.min(dropY - 40, 600))
          },
          config: { ...template.defaultConfig },
          connections: [],
          issues: [],
          metrics: { ...template.baseMetrics }
        };

        addComponent(newComponent);
      }
    }
  };

  const formatTime = (days: number) => {
    if (days < 1) return `${Math.round(days * 24)}h`;
    if (days < 30) return `${Math.round(days)}d`;
    return `${Math.round(days / 30)}mo`;
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Compact Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Platform Development Simulator
              </h1>
            </div>
            
            {/* Compact Controls */}
            <div className="flex items-center space-x-2">
              {currentScenario && (
                <div className="text-xs bg-blue-50 border border-blue-200 rounded px-2 py-1">
                  <div className="text-blue-600 font-medium">{currentScenario.title}</div>
                </div>
              )}
              
              <div className="text-xs text-gray-600">
                {formatTime(totalTime)}
              </div>
              
              <select
                value={simulationSpeed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="text-xs border border-gray-300 rounded px-1 py-1"
                disabled={!isRunning}
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
              
              <button
                onClick={() => setScenarioSelectorOpen(true)}
                className="px-2 py-1 border border-blue-300 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100"
                title="Choose scenario"
              >
                <Target className="w-3 h-3" />
              </button>
              
              <button
                onClick={isRunning ? pauseSimulation : startSimulation}
                className={`
                  px-2 py-1 rounded text-xs font-medium transition-colors
                  ${isRunning 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                  }
                `}
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              
              <button
                onClick={currentScenario ? clearScenario : () => window.location.reload()}
                className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
                title="Reset"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Component Palette - Resizable */}
          <ResizablePane 
            initialWidth={192}
            minWidth={150}
            maxWidth={320}
            side="left"
            className="bg-gray-50 border-r border-gray-200"
          >
            <div className="h-full overflow-hidden">
              <ComponentPalette />
            </div>
          </ResizablePane>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Platform Canvas */}
            <div className="flex-1 flex overflow-hidden">
              <PlatformCanvas />
            </div>
            
            {/* Bottom Panels - Resizable */}
            <ResizableBottomPane
              initialHeight={128}
              minHeight={80}
              maxHeight={300}
              className="border-t border-gray-200 bg-gray-50"
            >
              <div className="flex h-full overflow-hidden">
                {/* SecRel Pipeline */}
                <div className="flex-1 p-1 overflow-y-auto border-r border-gray-200">
                  <SecRelPipeline />
                </div>
                
                {/* Issues Panel */}
                <div className="flex-1 p-1 overflow-y-auto">
                  <IssuesPanel />
                </div>
              </div>
            </ResizableBottomPane>
          </div>
          
          {/* Metrics Dashboard - Resizable */}
          <ResizablePane 
            initialWidth={240}
            minWidth={200}
            maxWidth={400}
            side="right"
            className="bg-gray-50 border-l border-gray-200"
          >
            <div className="h-full overflow-hidden">
              <MetricsDashboard />
            </div>
          </ResizablePane>
        </div>

        {/* Compact Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 py-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>Platform Development Simulator</div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
          </div>
        </footer>

        {/* Scenario Selector Modal */}
        <ScenarioSelector
          isOpen={scenarioSelectorOpen}
          onClose={() => setScenarioSelectorOpen(false)}
          onSelectScenario={loadScenario}
        />
      </div>
    </DndContext>
  );
}
