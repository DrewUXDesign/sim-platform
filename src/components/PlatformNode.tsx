import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { PlatformNode as PlatformNodeType, ComponentLayer } from '@/types/platform';
import { getNodeTemplate } from '@/lib/platform-templates';
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

interface PlatformNodeProps {
  node: PlatformNodeType;
  isSelected: boolean;
  isHovered: boolean;
  canAcceptDrop: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onHover: (hovering: boolean) => void;
  children?: React.ReactNode;
}

const PlatformNode = React.memo<PlatformNodeProps>(({
  node,
  isSelected,
  isHovered,
  canAcceptDrop,
  onSelect,
  onDelete,
  onHover,
  children
}) => {
  const template = getNodeTemplate(node.type);
  const Icon = iconMap[template?.icon || 'Settings'];
  
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: node.id,
    data: { node },
    disabled: node.layer === ComponentLayer.INFRASTRUCTURE && node.type === 'region'
  });
  
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: node.id,
    data: { node }
  });
  
  const setNodeRef = React.useCallback((el: HTMLDivElement | null) => {
    setDragRef(el);
    setDropRef(el);
  }, [setDragRef, setDropRef]);
  
  const style: React.CSSProperties = {
    position: 'absolute',
    left: node.position.x,
    top: node.position.y,
    width: node.size?.width || 150,
    height: node.size?.height || 100,
    opacity: isDragging ? 0.3 : 1,
    zIndex: getLayerZIndex(node.layer) + (isSelected ? 10 : 0),
    transition: isDragging ? 'none' : 'left 0.2s ease-out, top 0.2s ease-out, opacity 0.2s ease-out'
  };
  
  const borderColors = {
    [ComponentLayer.INFRASTRUCTURE]: 'border-purple-400',
    [ComponentLayer.PLATFORM]: 'border-blue-400',
    [ComponentLayer.SERVICE]: 'border-green-400',
    [ComponentLayer.APPLICATION]: 'border-yellow-400'
  };
  
  const bgColors = {
    [ComponentLayer.INFRASTRUCTURE]: 'bg-purple-50',
    [ComponentLayer.PLATFORM]: 'bg-blue-50',
    [ComponentLayer.SERVICE]: 'bg-green-50',
    [ComponentLayer.APPLICATION]: 'bg-yellow-50'
  };
  
  const healthColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    unhealthy: 'bg-red-500'
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        rounded-lg border-2 cursor-move platform-node gpu-accelerated
        ${borderColors[node.layer]}
        ${bgColors[node.layer]}
        ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
        ${isHovered && !isDragging ? 'shadow-lg' : 'shadow'}
        ${canAcceptDrop || (isOver && canAcceptDrop) ? 'drop-zone-active' : ''}
        ${isDragging ? 'dragging' : ''}
        transition-shadow
      `}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      data-dragging={isDragging}
      {...attributes}
      {...listeners}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-medium truncate">{node.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${healthColors[node.status.health]}`} />
          {node.layer === ComponentLayer.APPLICATION && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-gray-400 hover:text-red-500"
            >
              <span className="text-xs">×</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-2 overflow-hidden" style={{ height: 'calc(100% - 32px)' }}>
        {/* Resource Usage Bar for infrastructure/platform nodes */}
        {node.resources && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Resources</span>
              <span>{Math.round(node.status.utilization)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${node.status.utilization}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Metrics for applications */}
        {node.layer === ComponentLayer.APPLICATION && (
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>
              <span className="text-gray-500">CPU:</span>
              <span className="ml-1">{node.resources?.cpu || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Mem:</span>
              <span className="ml-1">{node.resources?.memory || 0}MB</span>
            </div>
            <div>
              <span className="text-gray-500">Replicas:</span>
              <span className="ml-1">{node.config.replicas || 1}</span>
            </div>
            <div>
              <span className="text-gray-500">Cost:</span>
              <span className="ml-1">${node.metrics.cost}</span>
            </div>
          </div>
        )}
        
        {/* Child nodes container */}
        {children && (
          <div className="relative w-full h-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.position.x === nextProps.node.position.x &&
    prevProps.node.position.y === nextProps.node.position.y &&
    prevProps.node.size?.width === nextProps.node.size?.width &&
    prevProps.node.size?.height === nextProps.node.size?.height &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.canAcceptDrop === nextProps.canAcceptDrop &&
    prevProps.node.status.health === nextProps.node.status.health &&
    prevProps.node.status.utilization === nextProps.node.status.utilization
  );
});

export default PlatformNode;

function getLayerZIndex(layer: ComponentLayer): number {
  const zIndexMap = {
    [ComponentLayer.INFRASTRUCTURE]: 1,
    [ComponentLayer.PLATFORM]: 2,
    [ComponentLayer.SERVICE]: 3,
    [ComponentLayer.APPLICATION]: 4
  };
  return zIndexMap[layer] || 0;
}