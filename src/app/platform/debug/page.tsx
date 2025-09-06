'use client';

import React from 'react';

export default function DebugPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="h-12 bg-blue-500 text-white flex items-center px-4">
        Header
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[280px] bg-green-500 text-white p-4">
          LEFT PANEL - 280px wide
        </div>
        
        <div className="flex-1 bg-gray-300 p-4">
          CENTER - Flexible width
        </div>
        
        <div className="w-[280px] bg-red-500 text-white p-4">
          RIGHT PANEL - 280px wide
        </div>
      </div>
      
      <footer className="h-8 bg-blue-500 text-white flex items-center px-4">
        Footer
      </footer>
    </div>
  );
}