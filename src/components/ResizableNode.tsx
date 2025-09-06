'use client';

import React, { useState, useCallback } from 'react';
import { PlatformNode as PlatformNodeType } from '@/types/platform';

interface ResizableNodeProps {
  node: PlatformNodeType;
  isSelected: boolean;
  onResize: (id: string, size: { width: number; height: number }) => void;
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export default function ResizableNode({
  node,
  isSelected,
  onResize,
  children,
  minWidth = 100,
  minHeight = 60,
  maxWidth = 1200,
  maxHeight = 800
}: ResizableNodeProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  const handleMouseDown = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setStartSize({
      width: node.size?.width || 150,
      height: node.size?.height || 100
    });
    setStartPos({ x: e.clientX, y: e.clientY });
  }, [node.size]);
  
  React.useEffect(() => {
    if (!isResizing) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeHandle) return;
      
      // Use requestAnimationFrame to throttle resize updates for better performance
      requestAnimationFrame(() => {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;
        
        let newWidth = startSize.width;
        let newHeight = startSize.height;
        
        // Calculate new dimensions based on handle
        switch (resizeHandle) {
          case 'e':
            newWidth = startSize.width + deltaX;
            break;
          case 'w':
            newWidth = startSize.width - deltaX;
            break;
          case 's':
            newHeight = startSize.height + deltaY;
            break;
          case 'n':
            newHeight = startSize.height - deltaY;
            break;
          case 'se':
            newWidth = startSize.width + deltaX;
            newHeight = startSize.height + deltaY;
            break;
          case 'sw':
            newWidth = startSize.width - deltaX;
            newHeight = startSize.height + deltaY;
            break;
          case 'ne':
            newWidth = startSize.width + deltaX;
            newHeight = startSize.height - deltaY;
            break;
          case 'nw':
            newWidth = startSize.width - deltaX;
            newHeight = startSize.height - deltaY;
            break;
        }
        
        // Apply constraints
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
        
        onResize(node.id, { width: newWidth, height: newHeight });
      });
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeHandle, startPos, startSize, node.id, onResize, minWidth, minHeight, maxWidth, maxHeight]);
  
  // Show resize handles for selected nodes (but not for regions as they're too large)
  if (!isSelected || node.type === 'region') return <>{children}</>;
  
  const handles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  
  const handleStyles: Record<ResizeHandle, React.CSSProperties> = {
    nw: { top: -4, left: -4, cursor: 'nw-resize' },
    n: { top: -4, left: '50%', transform: 'translateX(-50%)', cursor: 'n-resize' },
    ne: { top: -4, right: -4, cursor: 'ne-resize' },
    e: { top: '50%', right: -4, transform: 'translateY(-50%)', cursor: 'e-resize' },
    se: { bottom: -4, right: -4, cursor: 'se-resize' },
    s: { bottom: -4, left: '50%', transform: 'translateX(-50%)', cursor: 's-resize' },
    sw: { bottom: -4, left: -4, cursor: 'sw-resize' },
    w: { top: '50%', left: -4, transform: 'translateY(-50%)', cursor: 'w-resize' }
  };
  
  return (
    <div className="relative resizable-selected">
      {children}
      
      {/* Resize Handles */}
      {handles.map(handle => (
        <div
          key={handle}
          onMouseDown={(e) => handleMouseDown(e, handle)}
          className={`
            absolute w-2 h-2 bg-blue-500 border border-white rounded-full
            hover:scale-150 transition-transform z-50 resize-handle
            ${isResizing && resizeHandle === handle ? 'scale-150' : ''}
          `}
          style={handleStyles[handle]}
        />
      ))}
      
      {/* Size indicator while resizing */}
      {isResizing && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-50">
          {Math.round(node.size?.width || 0)} × {Math.round(node.size?.height || 0)}
        </div>
      )}
    </div>
  );
}