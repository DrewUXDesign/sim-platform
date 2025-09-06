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
  
  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return;
    
    // Prevent default scrolling
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
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
  }, [zoom, panOffset, setZoom, setPanOffset]);
  
  // Handle pan with space + drag or middle mouse
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && (e.shiftKey || isPanning))) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastPanOffset(panOffset);
      if (!isPanning) startPanning();
    }
  }, [isPanning, panOffset, startPanning]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setPanOffset({
      x: lastPanOffset.x + deltaX,
      y: lastPanOffset.y + deltaY
    });
  }, [isDragging, dragStart, lastPanOffset, setPanOffset]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (isPanning && !isDragging) stopPanning();
  }, [isDragging, isPanning, stopPanning]);
  
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && !isPanning) {
      e.preventDefault();
      startPanning();
    }
    
    // Zoom shortcuts
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
  }, [zoom, isPanning, setZoom, setPanOffset, startPanning]);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' && isPanning && !isDragging) {
      stopPanning();
    }
  }, [isPanning, isDragging, stopPanning]);
  
  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp, handleKeyDown, handleKeyUp]);
  
  return (
    <div
      ref={containerRef}
      className={`relative overflow-visible ${className} ${
        isPanning ? 'cursor-move' : ''
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      onMouseDown={handleMouseDown}
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
          Pan Mode (Hold Space)
        </div>
      )}
    </div>
  );
}