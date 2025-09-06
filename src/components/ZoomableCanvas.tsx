'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasZoom } from '@/hooks/use-canvas-zoom';
import ZoomControls from './ZoomControls';

interface ZoomableCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export default function ZoomableCanvas({ children, className = '' }: ZoomableCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPanOffset, setLastPanOffset] = useState({ x: 0, y: 0 });
  
  const {
    zoom,
    panOffset,
    isPanning,
    setZoom,
    setPanOffset,
    startPanning,
    stopPanning
  } = useCanvasZoom();
  
  // Handle wheel zoom with throttling
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    
    // Prevent default scrolling
    e.preventDefault();
    
    // Use requestAnimationFrame to throttle zoom updates
    requestAnimationFrame(() => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate zoom
      const delta = e.deltaY * -0.001;
      const scaleFactor = e.ctrlKey ? 0.5 : 1; // Fine zoom with Ctrl
      const newZoom = Math.max(0.25, Math.min(3, zoom + delta * scaleFactor));
      
      // Calculate new pan offset to zoom towards cursor
      if (newZoom !== zoom) {
        const zoomRatio = newZoom / zoom;
        const newPanX = x - (x - panOffset.x) * zoomRatio;
        const newPanY = y - (y - panOffset.y) * zoomRatio;
        
        setPanOffset({ x: newPanX, y: newPanY });
        setZoom(newZoom);
      }
    });
  }, [zoom, panOffset, setZoom, setPanOffset]);
  
  // Handle pan with middle mouse only (avoid conflicts with drag and drop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only handle middle mouse button to avoid interfering with drag and drop
    if (e.button === 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastPanOffset(panOffset);
      if (!isPanning) startPanning();
    }
  }, [isPanning, panOffset, startPanning]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setPanOffset({
        x: lastPanOffset.x + deltaX,
        y: lastPanOffset.y + deltaY
      });
    });
  }, [isDragging, dragStart, lastPanOffset, setPanOffset]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (isPanning && !isDragging) stopPanning();
  }, [isDragging, isPanning, stopPanning]);
  
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Zoom shortcuts only
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoom(Math.min(3, zoom * 1.2));
      } else if (e.key === '-') {
        e.preventDefault();
        setZoom(Math.max(0.25, zoom / 1.2));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
      }
    }
  }, [zoom, setZoom, setPanOffset]);
  
  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp, handleKeyDown]);
  
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className} ${
        isPanning ? 'cursor-move' : ''
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${panOffset.x % (20 * zoom)}px ${panOffset.y % (20 * zoom)}px`,
        pointerEvents: isDragging ? 'none' : 'auto'
      }}
    >
      {/* Zoomable content */}
      <div
        ref={canvasRef}
        className="origin-top-left transition-none"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
      
      {/* Zoom Controls */}
      <ZoomControls />
      
      {/* Pan indicator */}
      {isPanning && !isDragging && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-50">
          Pan Mode (Middle Mouse)
        </div>
      )}
    </div>
  );
}