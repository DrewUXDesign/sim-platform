'use client';

import React, { useState } from 'react';
import { PlatformComponent } from '@/types/simulation';
import { X, Trash2, Shield, Zap, Activity } from 'lucide-react';

interface ComponentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: PlatformComponent;
  onSave: (component: PlatformComponent) => void;
  onDelete: (componentId: string) => void;
}

export default function ComponentConfigModal({ 
  isOpen, 
  onClose, 
  component, 
  onSave, 
  onDelete 
}: ComponentConfigModalProps) {
  const [config, setConfig] = useState(component.config);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...component,
      config
    });
  };

  const handleCheckboxChange = (
    section: 'security' | 'performance' | 'reliability',
    field: string,
    value: boolean
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleRateLimitChange = (value: number) => {
    setConfig(prev => ({
      ...prev,
      rateLimit: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{component.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Configure component settings</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDelete(component.id)}
              className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50"
              title="Delete component"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rate Limiting (for APIs) */}
          {component.type === 'api' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Rate Limiting</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requests per second
                  </label>
                  <input
                    type="number"
                    value={config.rateLimit || 1000}
                    onChange={(e) => handleRateLimitChange(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher limits improve performance but may impact stability under load
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security Configuration */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {config.security && Object.entries(config.security).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleCheckboxChange('security', key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Performance Configuration */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Performance</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {config.performance && Object.entries(config.performance).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleCheckboxChange('performance', key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reliability Configuration */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Reliability</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {config.reliability && Object.entries(config.reliability).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleCheckboxChange('reliability', key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Current Metrics Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Current Metrics</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Performance</span>
                <div className="font-medium text-blue-600">{component.metrics.performance}%</div>
              </div>
              <div>
                <span className="text-gray-500">Security</span>
                <div className="font-medium text-green-600">{component.metrics.security}%</div>
              </div>
              <div>
                <span className="text-gray-500">Reliability</span>
                <div className="font-medium text-purple-600">{component.metrics.reliability}%</div>
              </div>
            </div>
          </div>

          {/* Issues */}
          {component.issues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-900 mb-2">Active Issues</h3>
              <div className="space-y-2">
                {component.issues.map(issue => (
                  <div key={issue.id} className="text-sm">
                    <div className="font-medium text-red-800">{issue.title}</div>
                    <div className="text-red-600">{issue.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}