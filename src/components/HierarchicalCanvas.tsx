'use client';

import React, { useCallback, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { usePlatform } from '@/hooks/use-platform';
import { ComponentLayer, PlatformNode as PlatformNodeType } from '@/types/platform';
import PlatformNode from './PlatformNode';
import ResizableNode from './ResizableNode';
import ZoomableCanvas from './ZoomableCanvas';
import { useCanvasZoom } from '@/hooks/use-canvas-zoom';

interface HierarchicalCanvasProps {
  dragOverNodeId?: string | null;
}

interface MemoizedNodeWrapperProps {
  nodeId: string;
  node: PlatformNodeType;
  childIds: string[];
  isSelected: boolean;
  isHovered: boolean;
  canAcceptDrop: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onHover: (hovering: boolean) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  renderNode: (nodeId: string) => React.ReactNode;
}

const MemoizedNodeWrapper = React.memo<MemoizedNodeWrapperProps>(({
  nodeId,
  node,
  childIds,
  isSelected,
  isHovered,
  canAcceptDrop,
  onSelect,
  onDelete,
  onHover,
  onResize,
  renderNode
}) => {
  return (
    <ResizableNode
      node={node}
      isSelected={isSelected}
      onResize={onResize}
    >
      <PlatformNode
        node={node}
        isSelected={isSelected}
        isHovered={isHovered}
        canAcceptDrop={canAcceptDrop}
        onSelect={onSelect}
        onDelete={onDelete}
        onHover={onHover}
      >
        {childIds.map(childId => renderNode(childId))}
      </PlatformNode>
    </ResizableNode>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.node === nextProps.node &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.canAcceptDrop === nextProps.canAcceptDrop &&
    prevProps.childIds.length === nextProps.childIds.length &&
    prevProps.childIds.every((id, index) => id === nextProps.childIds[index])
  );
});

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
  
  console.log('Canvas droppable isOver:', isOver);
  
  
  // Memoize node children to prevent recalculation
  const nodeChildrenMap = useMemo(() => {
    const map = new Map<string, string[]>();
    Array.from(nodes.values()).forEach(node => {
      map.set(node.id, node.childIds);
    });
    return map;
  }, [nodes]);

  const renderNode = useCallback((nodeId: string): React.ReactNode => {
    const node = nodes.get(nodeId);
    if (!node) return null;
    
    const childIds = nodeChildrenMap.get(nodeId) || [];
    const canAccept = draggedNodeType ? canAcceptNode(nodeId, draggedNodeType) : false;
    
    return (
      <MemoizedNodeWrapper
        key={node.id}
        nodeId={nodeId}
        node={node}
        childIds={childIds}
        isSelected={selectedNodeId === node.id}
        isHovered={hoveredNodeId === node.id}
        canAcceptDrop={dragOverNodeId === node.id || (canAccept && isOver)}
        onSelect={() => selectNode(node.id)}
        onDelete={() => deleteNode(node.id)}
        onHover={(hovering) => setHoveredNode(hovering ? node.id : null)}
        onResize={(id, size) => updateNode(id, { size })}
        renderNode={renderNode}
      />
    );
  }, [
    nodes,
    nodeChildrenMap,
    selectedNodeId,
    hoveredNodeId,
    dragOverNodeId,
    draggedNodeType,
    isOver,
    canAcceptNode,
    selectNode,
    deleteNode,
    setHoveredNode,
    updateNode
  ]);
  
  // Find root nodes (no parent)
  const rootNodes = Array.from(nodes.values()).filter(node => !node.parentId);
  
  return (
    <div 
      ref={setNodeRef}
      id="canvas"
      className="w-full h-full bg-gray-50 rounded-lg"
    >
      <ZoomableCanvas className="w-full h-full">
        <div
          className="relative platform-canvas gpu-accelerated"
          style={{ 
            width: '1000px',
            height: '600px'
          }}
        >
        
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