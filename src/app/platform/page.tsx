'use client';

import React from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import HierarchicalCanvas from '@/components/HierarchicalCanvas';
import LayeredPalette from '@/components/LayeredPalette';
import ResourceMetrics from '@/components/ResourceMetrics';
import DragOverlay from '@/components/DragOverlay';
import WelcomeModal from '@/components/WelcomeModal';
import TutorialOverlay from '@/components/TutorialOverlay';
import CompletionModal from '@/components/CompletionModal';
import { usePlatform } from '@/hooks/use-platform';
import { useCanvasZoom } from '@/hooks/use-canvas-zoom';
import { useTutorial } from '@/hooks/use-tutorial';
import { getNodeTemplate } from '@/lib/platform-templates';
import { ComponentLayer, InfrastructureType, PlatformNode } from '@/types/platform';
import { Play, Pause, RotateCcw, Layers, Activity, GitBranch, PanelLeftOpen, PanelRightOpen, PanelLeftClose, PanelRightClose, BookOpen } from 'lucide-react';

export default function PlatformPage() {
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [dragOverNodeId, setDragOverNodeId] = React.useState<string | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeNode, setActiveNode] = React.useState<PlatformNode | null>(null);
  const [activeTemplate, setActiveTemplate] = React.useState<any>(null);
  const [showLeftPanel, setShowLeftPanel] = React.useState(true);
  const [showRightPanel, setShowRightPanel] = React.useState(true);
  
  const {
    nodes,
    addNode,
    updateNode,
    canAcceptNode,
    setDraggedNodeType
  } = usePlatform();
  
  const { zoom, panOffset, screenToCanvas } = useCanvasZoom();
  
  // Auto-add components during tutorial
  const addTutorialComponent = React.useCallback((stepId: string) => {
    console.log('addTutorialComponent called with stepId:', stepId);
    
    const rootNodes = Array.from(nodes.values()).filter(node => !node.parentId);
    const regionNode = rootNodes.find(node => node.type === InfrastructureType.REGION);
    
    console.log('RegionNode found:', regionNode?.id, regionNode?.name);
    
    if (!regionNode) {
      console.log('No region node found, skipping tutorial action');
      return;
    }
    
    switch (stepId) {
      case 'add-availability-zone':
        addNode({
          type: InfrastructureType.AVAILABILITY_ZONE,
          name: 'Primary AZ',
          position: { x: 50, y: 50 },
          size: { width: 400, height: 300 }
        }, regionNode.id);
        break;
        
      case 'add-compute':
        const azNodes = Array.from(nodes.values()).filter(node => 
          node.type === InfrastructureType.AVAILABILITY_ZONE
        );
        if (azNodes.length > 0) {
          addNode({
            type: InfrastructureType.COMPUTE,
            name: 'Web Server',
            position: { x: 20, y: 40 },
            size: { width: 120, height: 80 }
          }, azNodes[0].id);
        }
        break;
        
      case 'add-database':
        const azNodes2 = Array.from(nodes.values()).filter(node => 
          node.type === InfrastructureType.AVAILABILITY_ZONE
        );
        if (azNodes2.length > 0) {
          addNode({
            type: InfrastructureType.DATABASE,
            name: 'App Database',
            position: { x: 160, y: 40 },
            size: { width: 120, height: 80 }
          }, azNodes2[0].id);
        }
        break;
        
      case 'add-load-balancer':
        const azNodes3 = Array.from(nodes.values()).filter(node => 
          node.type === InfrastructureType.AVAILABILITY_ZONE
        );
        if (azNodes3.length > 0) {
          addNode({
            type: InfrastructureType.LOAD_BALANCER,
            name: 'Traffic Manager',
            position: { x: 90, y: 140 },
            size: { width: 120, height: 60 }
          }, azNodes3[0].id);
        }
        break;
    }
  }, [nodes, addNode]);
  
  const {
    isWelcomeModalOpen,
    isGuidedMode,
    isTutorialComplete,
    currentStep,
    steps,
    startGuided,
    startFreestyle,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    resetTutorial
  } = useTutorial();
  
  // Initialize with a region if empty
  React.useEffect(() => {
    if (nodes.size === 0) {
      addNode({
        type: InfrastructureType.REGION,
        name: 'Primary Region',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 500 }
      });
    }
  }, []);

  // Execute tutorial actions when steps change
  React.useEffect(() => {
    if (isGuidedMode && currentStep < steps.length) {
      const currentStepData = steps[currentStep];
      console.log('Tutorial step changed to:', currentStepData.id);
      
      // Add a small delay to let UI update first
      setTimeout(() => {
        addTutorialComponent(currentStepData.id);
      }, 500);
    }
  }, [currentStep, isGuidedMode, steps, addTutorialComponent]);
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
    
    if (active.data.current?.node) {
      setActiveNode(active.data.current.node);
      setActiveTemplate(null);
    } else if (active.data.current?.template) {
      setActiveTemplate(active.data.current.template);
      setActiveNode(null);
      setDraggedNodeType(active.data.current.type);
    }
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    
    if (over && active.data.current?.type) {
      const nodeType = active.data.current.type;
      const overId = over.id.toString();
      
      if (overId === 'canvas') {
        const template = getNodeTemplate(nodeType);
        if (template?.layer === ComponentLayer.INFRASTRUCTURE) {
          setDragOverNodeId(null);
        }
      } else if (canAcceptNode(overId, nodeType)) {
        setDragOverNodeId(overId);
      } else {
        setDragOverNodeId(null);
      }
    } else {
      setDragOverNodeId(null);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    
    // Debug logging
    console.log('Drag End:', {
      activeId: active.id,
      overId: over?.id,
      activeData: active.data.current,
      overData: over?.data.current
    });
    
    setActiveId(null);
    setActiveNode(null);
    setActiveTemplate(null);
    
    // Handle moving existing nodes
    if (active.data.current?.node) {
      const node = active.data.current.node;
      if (delta) {
        // Use requestAnimationFrame for smoother updates
        // Account for zoom when calculating delta
        requestAnimationFrame(() => {
          const scaledDelta = {
            x: delta.x / zoom,
            y: delta.y / zoom
          };
          updateNode(node.id, {
            position: {
              x: Math.max(0, node.position.x + scaledDelta.x),
              y: Math.max(0, node.position.y + scaledDelta.y)
            }
          });
        });
      }
      setDragOverNodeId(null);
      setDraggedNodeType(null);
      return;
    }
    
    // Handle adding new nodes from palette
    if (!over || !active.data.current?.type) {
      setDragOverNodeId(null);
      setDraggedNodeType(null);
      return;
    }
    
    const nodeType = active.data.current.type;
    const template = getNodeTemplate(nodeType);
    
    if (!template) {
      setDragOverNodeId(null);
      setDraggedNodeType(null);
      return;
    }
    
    let parentId: string | undefined;
    let position = { x: 100, y: 100 };
    
    if (over.id === 'canvas') {
      // Dropping on canvas - only infrastructure nodes allowed
      if (template.layer !== ComponentLayer.INFRASTRUCTURE) {
        setDragOverNodeId(null);
        setDraggedNodeType(null);
        return;
      }
    } else {
      // Dropping on a node
      parentId = over.id.toString();
      if (!canAcceptNode(parentId, nodeType)) {
        setDragOverNodeId(null);
        setDraggedNodeType(null);
        return;
      }
      
      // Calculate position relative to parent
      const parent = nodes.get(parentId);
      if (parent) {
        const childCount = parent.childIds.length;
        position = {
          x: 20 + (childCount % 3) * 150,
          y: 40 + Math.floor(childCount / 3) * 100
        };
      }
    }
    
    console.log('Adding node:', {
      type: nodeType,
      name: template.name,
      position,
      size: template.defaultSize,
      parentId
    });
    
    addNode({
      type: nodeType,
      name: template.name,
      position,
      size: template.defaultSize
    }, parentId);
    
    setDragOverNodeId(null);
    setDraggedNodeType(null);
  };
  
  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd} 
      onDragOver={handleDragOver}
    >
      <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Platform Simulator
              </h1>
              <p className="text-xs text-gray-600">Build and manage cloud infrastructure</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                showLeftPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
              title="Toggle component palette"
            >
              {showLeftPanel ? <PanelLeftClose className="w-3 h-3" /> : <PanelLeftOpen className="w-3 h-3" />}
            </button>
            
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                showRightPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
              title="Toggle metrics panel"
            >
              {showRightPanel ? <PanelRightClose className="w-3 h-3" /> : <PanelRightOpen className="w-3 h-3" />}
            </button>
            
            <div className="w-px h-4 bg-gray-300" />
            
            <button
              onClick={resetTutorial}
              className="px-3 py-1 border border-blue-300 rounded text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2"
              title="Start tutorial"
            >
              <BookOpen className="w-3 h-3" />
              <span>Tutorial</span>
            </button>
            
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2
                ${isSimulating 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
                }
              `}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>Simulate</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Component Palette */}
        {showLeftPanel && (
          <div className="w-52 lg:w-56 h-full bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            <LayeredPalette />
          </div>
        )}
        
        {/* Canvas */}
        <div className="flex-1">
          <HierarchicalCanvas dragOverNodeId={dragOverNodeId} />
        </div>
        
        {/* Metrics Dashboard */}
        {showRightPanel && (
          <div className="w-52 lg:w-56 h-full bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
            <ResourceMetrics />
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      <footer className="bg-white border-t border-gray-200 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Platform Active</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              <span>v2.0.0</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>{isSimulating ? 'Simulating traffic...' : 'Idle'}</span>
          </div>
        </div>
      </footer>
      
      <DragOverlay 
        activeId={activeId}
        activeNode={activeNode}
        activeTemplate={activeTemplate}
      />
      
      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={isWelcomeModalOpen}
        onChooseGuided={startGuided}
        onChooseFreestyle={startFreestyle}
      />
      
      {/* Tutorial Overlay */}
      <TutorialOverlay 
        isActive={isGuidedMode}
        currentStep={currentStep}
        steps={steps}
        onNext={nextStep}
        onPrevious={previousStep}
        onSkip={skipTutorial}
        onComplete={completeTutorial}
      />
      
      {/* Completion Modal */}
      <CompletionModal 
        isOpen={isTutorialComplete}
        onContinue={startFreestyle}
      />
    </div>
    </DndContext>
  );
}