'use client';

import React from 'react';
import ResourceMetrics from '@/components/ResourceMetrics';

export default function TestPage() {
  return (
    <div className="h-screen flex bg-gray-100">
      <div className="w-64 bg-blue-100 p-4">
        <h2>Left Panel</h2>
        <p>This is the left panel</p>
      </div>
      
      <div className="flex-1 bg-white p-4">
        <h2>Center Content</h2>
        <p>This is the center area</p>
      </div>
      
      <div className="w-64 bg-red-100 p-4">
        <h2>Right Panel - Metrics Should Be Here</h2>
        <ResourceMetrics />
      </div>
    </div>
  );
}