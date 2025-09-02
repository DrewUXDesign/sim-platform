'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ResizablePaneProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  side?: 'left' | 'right';
  className?: string;
}

export default function ResizablePane({ 
  children, 
  initialWidth = 240,
  minWidth = 180,
  maxWidth = 400,
  side = 'left',
  className = ''
}: ResizablePaneProps) {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const paneRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !paneRef.current) return;

    const rect = paneRef.current.getBoundingClientRect();
    let newWidth: number;

    if (side === 'left') {
      newWidth = e.clientX - rect.left;
    } else {
      newWidth = rect.right - e.clientX;
    }

    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(newWidth);
  }, [isResizing, side, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={paneRef}
      className={`relative ${className}`}
      style={{ width: `${width}px` }}
    >
      {children}
      
      {/* Resize Handle */}
      <div
        className={`absolute top-0 ${side === 'left' ? '-right-1' : '-left-1'} h-full w-2 cursor-ew-resize group hover:bg-blue-200 transition-colors`}
        onMouseDown={handleMouseDown}
      >
        <div className={`absolute top-0 ${side === 'left' ? 'right-0' : 'left-0'} h-full w-px bg-gray-300 group-hover:bg-blue-400 transition-colors`} />
        
        {/* Resize indicator dots */}
        <div className={`absolute top-1/2 ${side === 'left' ? 'right-0.5' : 'left-0.5'} transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
          <div className="w-1 h-1 bg-blue-400 rounded-full" />
          <div className="w-1 h-1 bg-blue-400 rounded-full" />
          <div className="w-1 h-1 bg-blue-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}

interface ResizableBottomPaneProps {
  children: React.ReactNode;
  initialHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

export function ResizableBottomPane({
  children,
  initialHeight = 192,
  minHeight = 120,
  maxHeight = 400,
  className = ''
}: ResizableBottomPaneProps) {
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const paneRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !paneRef.current) return;

    const rect = paneRef.current.getBoundingClientRect();
    const newHeight = rect.bottom - e.clientY;
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    setHeight(clampedHeight);
  }, [isResizing, minHeight, maxHeight]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={paneRef}
      className={`relative ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize group hover:bg-blue-200 transition-colors"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gray-300 group-hover:bg-blue-400 transition-colors" />
        
        {/* Resize indicator dots */}
        <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-1 bg-blue-400 rounded-full" />
          <div className="w-1 h-1 bg-blue-400 rounded-full" />
          <div className="w-1 h-1 bg-blue-400 rounded-full" />
        </div>
      </div>
      
      {children}
    </div>
  );
}