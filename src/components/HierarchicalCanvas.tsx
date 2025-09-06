'use client';

import React, { useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { usePlatform } from '@/hooks/use-platform';
import { ComponentLayer } from '@/types/platform';
import PlatformNode from './PlatformNode';
import ResizableNode from './ResizableNode';
import ZoomableCanvas from './ZoomableCanvas';
import { useCanvasZoom } from '@/hooks/use-canvas-zoom';

interface HierarchicalCanvasProps {
  dragOverNodeId?: string | null;
}

export default function HierarchicalCanvas({ dragOverNodeId }: HierarchicalCanvasProps) {
  const {
    nodes,
    selectedNodeId,
    hoveredNodeId,
    draggedNodeType,
    deleteNode,
    selectNode,
    setHoveredNode,
    updateNode,
    canAcceptNode,
    getNodeChildren
  } = usePlatform();
  
  const { zoom } = useCanvasZoom();
  
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: { accepts: ComponentLayer.INFRASTRUCTURE }
  });
  
  
  const renderNode = useCallback((nodeId: string): React.ReactNode => {
    const node = nodes.get(nodeId);
    if (!node) return null;
    
    const children = getNodeChildren(nodeId);
    const canAccept = draggedNodeType ? canAcceptNode(nodeId, draggedNodeType) : false;
    
    return (
      <ResizableNode
        key={node.id}
        node={node}
        isSelected={selectedNodeId === node.id}
        onResize={(id, size) => updateNode(id, { size })}
      >
        <PlatformNode
          node={node}
          isSelected={selectedNodeId === node.id}
          isHovered={hoveredNodeId === node.id}
          canAcceptDrop={dragOverNodeId === node.id || (canAccept && isOver)}
          onSelect={() => selectNode(node.id)}
          onDelete={() => deleteNode(node.id)}
          onHover={(hovering) => setHoveredNode(hovering ? node.id : null)}
        >
          {children.map(child => renderNode(child.id))}
        </PlatformNode>
      </ResizableNode>
    );
  }, [
    nodes,
    selectedNodeId,
    hoveredNodeId,
    dragOverNodeId,
    draggedNodeType,
    isOver,
    canAcceptNode,
    getNodeChildren,
    selectNode,
    deleteNode,
    setHoveredNode,
    updateNode
  ]);
  
  // Find root nodes (no parent)
  const rootNodes = Array.from(nodes.values()).filter(node => !node.parentId);
  
  return (
    <div className="w-full h-full bg-gray-50 rounded-lg">
      <ZoomableCanvas className="w-full h-full">
        <div
          ref={setNodeRef}
          id="canvas"
          className="relative platform-canvas gpu-accelerated"
          style={{ 
            width: '1200px',
            height: '800px'
          }}
        >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Empty state */}
        {nodes.size === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">Platform Canvas</div>
              <div className="text-sm">Initializing platform...</div>
            </div>
          </div>
        )}
        
        {/* Render all root nodes and their children */}
        {rootNodes.map(node => renderNode(node.id))}
        
        {/* Drop indicator for canvas */}
        {isOver && draggedNodeType && (
          <div className="absolute inset-0 bg-blue-50 bg-opacity-30 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center pointer-events-none drop-zone-active">
            <span className="text-blue-600 font-medium">Drop to add to canvas</span>
          </div>
        )}
        </div>
      </ZoomableCanvas>
    </div>
  );
}