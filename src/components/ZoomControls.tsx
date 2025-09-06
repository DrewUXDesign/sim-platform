'use client';

import React from 'react';
import { useCanvasZoom } from '@/hooks/use-canvas-zoom';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Move, 
  RotateCcw,
  Minimize2
} from 'lucide-react';

export default function ZoomControls() {
  const { 
    zoom, 
    minZoom, 
    maxZoom,
    isPanning,
    zoomIn, 
    zoomOut, 
    resetZoom,
    fitToScreen,
    startPanning,
    stopPanning,
    setZoom
  } = useCanvasZoom();
  
  const zoomPercentage = Math.round(zoom * 100);
  
  const handleZoomSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };
  
  return (
    <div className="absolute bottom-4 right-4 z-20">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex items-center gap-2">
          {/* Pan Tool */}
          <button
            onClick={() => isPanning ? stopPanning() : startPanning()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              isPanning ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title="Pan canvas (hold Space)"
          >
            <Move className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* Zoom Out */}
          <button
            onClick={zoomOut}
            disabled={zoom <= minZoom}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom out (Ctrl -)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          {/* Zoom Slider */}
          <div className="flex items-center gap-2 px-2">
            <input
              type="range"
              min={minZoom}
              max={maxZoom}
              step={0.1}
              value={zoom}
              onChange={handleZoomSlider}
              className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                  ((zoom - minZoom) / (maxZoom - minZoom)) * 100
                }%, #e5e7eb ${
                  ((zoom - minZoom) / (maxZoom - minZoom)) * 100
                }%, #e5e7eb 100%)`
              }}
            />
            <span className="text-xs font-medium text-gray-600 min-w-[40px]">
              {zoomPercentage}%
            </span>
          </div>
          
          {/* Zoom In */}
          <button
            onClick={zoomIn}
            disabled={zoom >= maxZoom}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom in (Ctrl +)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          {/* Fit to Screen */}
          <button
            onClick={fitToScreen}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Fit to screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          
          {/* Reset Zoom */}
          <button
            onClick={resetZoom}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Reset zoom (100%)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Keyboard Shortcuts Hint */}
      <div className="mt-2 text-xs text-gray-500 text-right">
        <div>Scroll: Zoom</div>
        <div>Space + Drag: Pan</div>
        <div>Ctrl + Scroll: Fine zoom</div>
      </div>
    </div>
  );
}