'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, X, Book, Lightbulb, AlertCircle } from 'lucide-react';

interface TooltipProps {
  title: string;
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'tip';
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
  trigger?: React.ReactNode;
}

export default function Tooltip({ 
  title, 
  children, 
  type = 'info',
  position = 'top',
  maxWidth = '320px',
  trigger
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const typeConfig = {
    info: {
      icon: HelpCircle,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900'
    },
    tip: {
      icon: Lightbulb,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let newPosition = position;
      
      // Check if tooltip would go off-screen and adjust position
      if (position === 'top' && rect.top - tooltipRect.height < 10) {
        newPosition = 'bottom';
      } else if (position === 'bottom' && rect.bottom + tooltipRect.height > window.innerHeight - 10) {
        newPosition = 'top';
      } else if (position === 'left' && rect.left - tooltipRect.width < 10) {
        newPosition = 'right';
      } else if (position === 'right' && rect.right + tooltipRect.width > window.innerWidth - 10) {
        newPosition = 'left';
      }
      
      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  const getPositionClasses = () => {
    const base = 'absolute z-50';
    switch (actualPosition) {
      case 'top':
        return `${base} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
      case 'bottom':
        return `${base} top-full left-1/2 transform -translate-x-1/2 mt-2`;
      case 'left':
        return `${base} right-full top-1/2 transform -translate-y-1/2 mr-2`;
      case 'right':
        return `${base} left-full top-1/2 transform -translate-y-1/2 ml-2`;
      default:
        return `${base} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
    }
  };

  const getArrowClasses = () => {
    const baseArrow = 'absolute w-0 h-0';
    switch (actualPosition) {
      case 'top':
        return `${baseArrow} top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-white`;
      case 'bottom':
        return `${baseArrow} bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-white`;
      case 'left':
        return `${baseArrow} left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-white`;
      case 'right':
        return `${baseArrow} right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-white`;
      default:
        return `${baseArrow} top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-white`;
    }
  };

  const defaultTrigger = (
    <button
      className={`p-1 rounded-full hover:bg-gray-100 ${config.iconColor} transition-colors`}
      title="Learn more"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help"
      >
        {trigger || defaultTrigger}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={getPositionClasses()}
          style={{ maxWidth }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className={`bg-white border ${config.borderColor} rounded-lg shadow-lg p-4 ${config.bgColor}`}>
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 p-1 ${config.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-semibold ${config.titleColor} mb-2`}>
                  {title}
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {children}
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  );
}

// ELI5 (Explain Like I'm 5) specific tooltip component
interface ELI5TooltipProps {
  concept: string;
  explanation: string;
  analogy?: string;
  learnMore?: string;
}

export function ELI5Tooltip({ concept, explanation, analogy, learnMore }: ELI5TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(!isVisible);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const modal = isVisible && mounted ? createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white border border-green-200 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-green-50 px-4 py-3 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-green-100 rounded">
                <Book className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-green-900">
                ELI5: {concept}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-base text-gray-700 leading-relaxed">{explanation}</p>
          
          {analogy && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-base text-blue-800">
                <strong>🔍 Think of it like:</strong> {analogy}
              </p>
            </div>
          )}
          
          {learnMore && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-base text-yellow-800">
                <strong>💡 Learn More:</strong> {learnMore}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors cursor-pointer"
      >
        <Book className="w-3 h-3" />
        <span>ELI5</span>
      </div>
      {modal}
    </>
  );
}