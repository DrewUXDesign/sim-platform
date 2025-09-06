'use client';

import React from 'react';
import ResourceMetrics from '@/components/ResourceMetrics';

export default function MetricsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Metrics Component Test</h1>
      
      <div className="max-w-sm bg-white rounded-lg shadow-lg">
        <ResourceMetrics />
      </div>
    </div>
  );
}