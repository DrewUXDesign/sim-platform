'use client';

import React, { useMemo } from 'react';
import { PlatformComponent, ComponentType } from '@/types/simulation';

interface ConnectionLinesProps {
  components: PlatformComponent[];
}

interface Connection {
  from: PlatformComponent;
  to: PlatformComponent;
  type: 'data' | 'request' | 'auth';
}

export default function ConnectionLines({ components }: ConnectionLinesProps) {
  const connections = useMemo(() => {
    const connections: Connection[] = [];
    
    // Add manual connections first
    components.forEach(component => {
      component.connections.forEach(connectionId => {
        const targetComponent = components.find(c => c.id === connectionId);
        if (targetComponent) {
          connections.push({
            from: component,
            to: targetComponent,
            type: 'data'
          });
        }
      });
    });
    
    // Auto-generate logical connections based on component types
    components.forEach(component => {
      switch (component.type) {
        case ComponentType.FRONTEND:
          // Frontend connects to APIs and CDNs
          const apis = components.filter(c => c.type === ComponentType.API);
          const cdns = components.filter(c => c.type === ComponentType.CDN);
          apis.forEach(api => connections.push({ from: component, to: api, type: 'request' }));
          cdns.forEach(cdn => connections.push({ from: component, to: cdn, type: 'request' }));
          break;
          
        case ComponentType.API:
          // APIs connect to databases, auth services, and caches
          const databases = components.filter(c => c.type === ComponentType.DATABASE);
          const authServices = components.filter(c => c.type === ComponentType.AUTH_SERVICE);
          const caches = components.filter(c => c.type === ComponentType.CACHE);
          const queues = components.filter(c => c.type === ComponentType.QUEUE);
          
          databases.forEach(db => connections.push({ from: component, to: db, type: 'data' }));
          authServices.forEach(auth => connections.push({ from: component, to: auth, type: 'auth' }));
          caches.forEach(cache => connections.push({ from: component, to: cache, type: 'data' }));
          queues.forEach(queue => connections.push({ from: component, to: queue, type: 'data' }));
          break;
          
        case ComponentType.LOAD_BALANCER:
          // Load balancers connect to APIs and microservices
          const apiTargets = components.filter(c => c.type === ComponentType.API || c.type === ComponentType.MICROSERVICE);
          apiTargets.forEach(target => connections.push({ from: component, to: target, type: 'request' }));
          break;
      }
    });
    
    return connections;
  }, [components]);

  const getConnectionPath = (from: PlatformComponent, to: PlatformComponent) => {
    const fromX = from.position.x + 60; // Center of component
    const fromY = from.position.y + 40;
    const toX = to.position.x + 60;
    const toY = to.position.y + 40;
    
    // Create a curved path
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    const controlX = midX + (Math.random() - 0.5) * 100;
    const controlY = midY - Math.abs(toX - fromX) * 0.3;
    
    return `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
  };

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'data': return '#3b82f6'; // blue
      case 'request': return '#10b981'; // green  
      case 'auth': return '#f59e0b'; // amber
      default: return '#6b7280'; // gray
    }
  };

  if (components.length < 2) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <defs>
        {/* Animated gradient definitions */}
        <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8">
            <animate attributeName="stop-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
          </stop>
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0,0;100,0;0,0"
            dur="2s"
            repeatCount="indefinite"
          />
        </linearGradient>
        
        <linearGradient id="requestFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;0.8;0" dur="1.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.8">
            <animate attributeName="stop-opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#10b981" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;0.8;0" dur="1.5s" repeatCount="indefinite" />
          </stop>
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0,0;100,0;0,0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </linearGradient>

        <linearGradient id="authFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;0.8;0" dur="2.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8">
            <animate attributeName="stop-opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0">
            <animate attributeName="stop-opacity" values="0;0.8;0" dur="2.5s" repeatCount="indefinite" />
          </stop>
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0,0;100,0;0,0"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </linearGradient>

        {/* Arrow markers */}
        <marker id="arrowData" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <polygon points="0,0 0,6 9,3" fill="#3b82f6" opacity="0.7" />
        </marker>
        
        <marker id="arrowRequest" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <polygon points="0,0 0,6 9,3" fill="#10b981" opacity="0.7" />
        </marker>
        
        <marker id="arrowAuth" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <polygon points="0,0 0,6 9,3" fill="#f59e0b" opacity="0.7" />
        </marker>
      </defs>
      
      {connections.map((connection, index) => {
        const path = getConnectionPath(connection.from, connection.to);
        const gradientId = `${connection.type}Flow`;
        const markerId = `arrow${connection.type.charAt(0).toUpperCase() + connection.type.slice(1)}`;
        
        return (
          <g key={`${connection.from.id}-${connection.to.id}-${index}`}>
            {/* Base line */}
            <path
              d={path}
              stroke={getConnectionColor(connection.type)}
              strokeWidth="2"
              fill="none"
              opacity="0.3"
              markerEnd={`url(#${markerId})`}
            />
            
            {/* Animated overlay */}
            <path
              d={path}
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              fill="none"
              opacity="0.8"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,20;10,10;0,20"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        );
      })}
      
      {/* Connection legend */}
      {connections.length > 0 && (
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="120" height="80" fill="white" fillOpacity="0.9" stroke="#e5e7eb" strokeWidth="1" rx="4" />
          <text x="8" y="15" fontSize="10" fill="#374151" fontWeight="600">Data Flow</text>
          <line x1="8" y1="25" x2="30" y2="25" stroke="#3b82f6" strokeWidth="2" opacity="0.7" />
          <text x="35" y="29" fontSize="8" fill="#6b7280">Data</text>
          <line x1="8" y1="40" x2="30" y2="40" stroke="#10b981" strokeWidth="2" opacity="0.7" />
          <text x="35" y="44" fontSize="8" fill="#6b7280">Requests</text>
          <line x1="8" y1="55" x2="30" y2="55" stroke="#f59e0b" strokeWidth="2" opacity="0.7" />
          <text x="35" y="59" fontSize="8" fill="#6b7280">Auth</text>
        </g>
      )}
    </svg>
  );
}