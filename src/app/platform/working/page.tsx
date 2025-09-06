'use client';

import React from 'react';
import { DndContext } from '@dnd-kit/core';
import ResourceMetrics from '@/components/ResourceMetrics';
import { Layers, Play, Pause, RotateCcw } from 'lucide-react';

export default function WorkingPage() {
  const [isSimulating, setIsSimulating] = React.useState(false);
  
  return (
    <DndContext>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Platform Simulator (Working Version)
                </h1>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className="w-[280px] bg-green-200 p-4">
            <h2 className="font-bold">Left Panel</h2>
            <p>Component Palette goes here</p>
          </div>
          
          {/* Center */}
          <div className="flex-1 bg-white p-4">
            <h2 className="font-bold">Canvas Area</h2>
            <p>Main canvas content</p>
          </div>
          
          {/* Right Panel - Metrics */}
          <div className="w-[280px] bg-red-200 border-l border-gray-300">
            <div className="p-2 bg-red-500 text-white">
              <h2 className="font-bold">RIGHT PANEL VISIBLE!</h2>
            </div>
            <ResourceMetrics />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 py-1">
          <div className="text-xs text-gray-600">Footer</div>
        </footer>
      </div>
    </DndContext>
  );
}