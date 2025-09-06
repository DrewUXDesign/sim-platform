import { create } from 'zustand';

interface CanvasZoomStore {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  panOffset: { x: number; y: number };
  isPanning: boolean;
  
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToScreen: () => void;
  
  setPanOffset: (offset: { x: number; y: number }) => void;
  startPanning: () => void;
  stopPanning: () => void;
  
  // Convert screen coordinates to canvas coordinates
  screenToCanvas: (x: number, y: number) => { x: number; y: number };
  // Convert canvas coordinates to screen coordinates
  canvasToScreen: (x: number, y: number) => { x: number; y: number };
}

export const useCanvasZoom = create<CanvasZoomStore>((set, get) => ({
  zoom: 1,
  minZoom: 0.25,
  maxZoom: 3,
  panOffset: { x: 0, y: 0 },
  isPanning: false,
  
  setZoom: (zoom) => {
    const { minZoom, maxZoom } = get();
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
    set({ zoom: clampedZoom });
  },
  
  zoomIn: () => {
    const { zoom, maxZoom } = get();
    const newZoom = Math.min(zoom * 1.2, maxZoom);
    set({ zoom: newZoom });
  },
  
  zoomOut: () => {
    const { zoom, minZoom } = get();
    const newZoom = Math.max(zoom / 1.2, minZoom);
    set({ zoom: newZoom });
  },
  
  resetZoom: () => {
    set({ zoom: 1, panOffset: { x: 0, y: 0 } });
  },
  
  fitToScreen: () => {
    // This would calculate the optimal zoom to fit all components
    // For now, just reset
    set({ zoom: 1, panOffset: { x: 0, y: 0 } });
  },
  
  setPanOffset: (offset) => {
    set({ panOffset: offset });
  },
  
  startPanning: () => {
    set({ isPanning: true });
  },
  
  stopPanning: () => {
    set({ isPanning: false });
  },
  
  screenToCanvas: (x, y) => {
    const { zoom, panOffset } = get();
    return {
      x: (x - panOffset.x) / zoom,
      y: (y - panOffset.y) / zoom
    };
  },
  
  canvasToScreen: (x, y) => {
    const { zoom, panOffset } = get();
    return {
      x: x * zoom + panOffset.x,
      y: y * zoom + panOffset.y
    };
  }
}));