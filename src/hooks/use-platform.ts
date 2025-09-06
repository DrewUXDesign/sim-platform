import { create } from 'zustand';
import {
  PlatformNode,
  PlatformState,
  ComponentLayer,
  Deployment,
  ResourceCapacity,
  InfrastructureType
} from '@/types/platform';
import { getNodeTemplate } from '@/lib/platform-templates';

interface PlatformStore {
  nodes: Map<string, PlatformNode>;
  deployments: Deployment[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  draggedNodeType: string | null;
  
  // Actions
  addNode: (node: Partial<PlatformNode>, parentId?: string) => string | null;
  updateNode: (id: string, updates: Partial<PlatformNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  setDraggedNodeType: (type: string | null) => void;
  
  // Deployment actions
  deployApplication: (appId: string, targetId: string, environment: 'development' | 'staging' | 'production') => void;
  updateDeployment: (id: string, updates: Partial<Deployment>) => void;
  removeDeployment: (id: string) => void;
  
  // Resource calculations
  getNodeResources: (id: string) => ResourceCapacity | null;
  canAcceptNode: (parentId: string, nodeType: string) => boolean;
  getNodeChildren: (id: string) => PlatformNode[];
  
  // Metrics
  calculateGlobalMetrics: () => PlatformState['globalMetrics'];
}

export const usePlatform = create<PlatformStore>((set, get) => ({
  nodes: new Map(),
  deployments: [],
  selectedNodeId: null,
  hoveredNodeId: null,
  draggedNodeType: null,
  
  addNode: (nodeData, parentId) => {
    const template = getNodeTemplate(nodeData.type as string);
    if (!template) return null;
    
    // Check if parent can contain this node
    if (parentId) {
      const parent = get().nodes.get(parentId);
      if (!parent || !get().canAcceptNode(parentId, nodeData.type as string)) {
        return null;
      }
    } else if (template.requiresParent) {
      // Node requires parent but none provided
      return null;
    }
    
    const id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const node: PlatformNode = {
      id,
      layer: template.layer,
      type: nodeData.type as any,
      name: nodeData.name || template.name,
      position: nodeData.position || { x: 100, y: 100 },
      size: nodeData.size || template.defaultSize,
      parentId,
      childIds: [],
      resources: template.resources ? {
        cpu: template.resources.cpu || 0,
        memory: template.resources.memory || 0,
        storage: template.resources.storage || 0,
        network: template.resources.network || 0,
        allocatedCpu: 0,
        allocatedMemory: 0,
        allocatedStorage: 0,
        allocatedNetwork: 0
      } as ResourceCapacity : undefined,
      config: nodeData.config || {
        replicas: 1,
        autoScaling: false,
        healthCheck: true,
        monitoring: true,
        logging: true
      },
      status: {
        health: 'healthy',
        utilization: 0,
        incidents: 0,
        latency: 0
      },
      metrics: {
        availability: 99.9,
        performance: 85,
        cost: template.baseCost,
        efficiency: 80
      }
    };
    
    set(state => {
      const newNodes = new Map(state.nodes);
      newNodes.set(id, node);
      
      // Update parent's childIds
      if (parentId) {
        const parent = newNodes.get(parentId);
        if (parent) {
          parent.childIds = [...parent.childIds, id];
          newNodes.set(parentId, { ...parent });
        }
      }
      
      return { nodes: newNodes };
    });
    
    return id;
  },
  
  updateNode: (id, updates) => {
    set(state => {
      const newNodes = new Map(state.nodes);
      const node = newNodes.get(id);
      if (node) {
        newNodes.set(id, { ...node, ...updates });
      }
      return { nodes: newNodes };
    });
  },
  
  deleteNode: (id) => {
    set(state => {
      const newNodes = new Map(state.nodes);
      const node = newNodes.get(id);
      if (!node) return state;
      
      // Remove from parent's childIds
      if (node.parentId) {
        const parent = newNodes.get(node.parentId);
        if (parent) {
          parent.childIds = parent.childIds.filter(childId => childId !== id);
          newNodes.set(node.parentId, { ...parent });
        }
      }
      
      // Recursively delete children
      const deleteRecursive = (nodeId: string) => {
        const n = newNodes.get(nodeId);
        if (n) {
          n.childIds.forEach(childId => deleteRecursive(childId));
          newNodes.delete(nodeId);
        }
      };
      
      deleteRecursive(id);
      
      // Remove deployments targeting this node
      const newDeployments = state.deployments.filter(d => 
        d.targetId !== id && d.applicationId !== id
      );
      
      return { 
        nodes: newNodes,
        deployments: newDeployments,
        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
      };
    });
  },
  
  selectNode: (id) => set({ selectedNodeId: id }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
  setDraggedNodeType: (type) => set({ draggedNodeType: type }),
  
  deployApplication: (appId, targetId, environment) => {
    const app = get().nodes.get(appId);
    const target = get().nodes.get(targetId);
    
    if (!app || !target) return;
    if (app.layer !== ComponentLayer.APPLICATION) return;
    if (![ComponentLayer.PLATFORM, ComponentLayer.SERVICE].includes(target.layer)) return;
    
    const deployment: Deployment = {
      id: `deploy-${Date.now()}`,
      applicationId: appId,
      targetId,
      environment,
      version: '1.0.0',
      status: 'deploying',
      replicas: app.config.replicas || 1,
      resources: app.resources as any || { cpu: 10, memory: 128, storage: 0, network: 0 },
      created: new Date(),
      updated: new Date()
    };
    
    set(state => ({
      deployments: [...state.deployments, deployment]
    }));
    
    // Simulate deployment completion
    setTimeout(() => {
      get().updateDeployment(deployment.id, { status: 'running' });
    }, 2000);
  },
  
  updateDeployment: (id, updates) => {
    set(state => ({
      deployments: state.deployments.map(d => 
        d.id === id ? { ...d, ...updates, updated: new Date() } : d
      )
    }));
  },
  
  removeDeployment: (id) => {
    set(state => ({
      deployments: state.deployments.filter(d => d.id !== id)
    }));
  },
  
  getNodeResources: (id) => {
    const node = get().nodes.get(id);
    if (!node || !node.resources) return null;
    
    // Calculate allocated resources from children and deployments
    let allocatedCpu = 0;
    let allocatedMemory = 0;
    let allocatedStorage = 0;
    let allocatedNetwork = 0;
    
    // Add resources from child nodes
    node.childIds.forEach(childId => {
      const child = get().nodes.get(childId);
      if (child?.resources) {
        allocatedCpu += child.resources.cpu || 0;
        allocatedMemory += child.resources.memory || 0;
        allocatedStorage += child.resources.storage || 0;
        allocatedNetwork += child.resources.network || 0;
      }
    });
    
    // Add resources from deployments
    get().deployments
      .filter(d => d.targetId === id && d.status === 'running')
      .forEach(d => {
        allocatedCpu += (d.resources.cpu || 0) * d.replicas;
        allocatedMemory += (d.resources.memory || 0) * d.replicas;
        allocatedStorage += (d.resources.storage || 0) * d.replicas;
        allocatedNetwork += (d.resources.network || 0) * d.replicas;
      });
    
    return {
      ...node.resources,
      allocatedCpu,
      allocatedMemory,
      allocatedStorage,
      allocatedNetwork
    } as ResourceCapacity;
  },
  
  canAcceptNode: (parentId, nodeType) => {
    const parent = get().nodes.get(parentId);
    if (!parent) return false;
    
    const template = getNodeTemplate(nodeType);
    if (!template) return false;
    
    const parentTemplate = getNodeTemplate(parent.type);
    if (!parentTemplate) return false;
    
    // Check if parent can contain this layer
    if (!parentTemplate.canContain.includes(template.layer)) return false;
    
    // Check resource availability if applicable
    if (parent.resources && template.resources) {
      const parentResources = get().getNodeResources(parentId);
      if (parentResources) {
        const availableCpu = (parentResources.cpu || 0) - (parentResources.allocatedCpu || 0);
        const availableMemory = (parentResources.memory || 0) - (parentResources.allocatedMemory || 0);
        const availableStorage = (parentResources.storage || 0) - (parentResources.allocatedStorage || 0);
        
        if ((template.resources.cpu || 0) > availableCpu) return false;
        if ((template.resources.memory || 0) > availableMemory) return false;
        if ((template.resources.storage || 0) > availableStorage) return false;
      }
    }
    
    return true;
  },
  
  getNodeChildren: (id) => {
    const node = get().nodes.get(id);
    if (!node) return [];
    
    return node.childIds
      .map(childId => get().nodes.get(childId))
      .filter(Boolean) as PlatformNode[];
  },
  
  calculateGlobalMetrics: () => {
    const nodes = Array.from(get().nodes.values());
    const deployments = get().deployments;
    
    let totalCost = 0;
    let totalCpu = 0;
    let totalMemory = 0;
    let totalStorage = 0;
    let totalNetwork = 0;
    let allocatedCpu = 0;
    let allocatedMemory = 0;
    let allocatedStorage = 0;
    let allocatedNetwork = 0;
    
    // Calculate totals from infrastructure nodes
    nodes.filter(n => n.layer === ComponentLayer.INFRASTRUCTURE).forEach(node => {
      totalCost += node.metrics.cost;
      if (node.resources) {
        totalCpu += node.resources.cpu || 0;
        totalMemory += node.resources.memory || 0;
        totalStorage += node.resources.storage || 0;
        totalNetwork += node.resources.network || 0;
      }
    });
    
    // Calculate allocated resources
    deployments.filter(d => d.status === 'running').forEach(d => {
      allocatedCpu += (d.resources.cpu || 0) * d.replicas;
      allocatedMemory += (d.resources.memory || 0) * d.replicas;
      allocatedStorage += (d.resources.storage || 0) * d.replicas;
      allocatedNetwork += (d.resources.network || 0) * d.replicas;
    });
    
    // Add costs from platform and service nodes
    nodes.filter(n => [ComponentLayer.PLATFORM, ComponentLayer.SERVICE].includes(n.layer))
      .forEach(node => {
        totalCost += node.metrics.cost;
      });
    
    const applicationCount = nodes.filter(n => n.layer === ComponentLayer.APPLICATION).length;
    const avgHealth = nodes.reduce((sum, n) => sum + (n.status.health === 'healthy' ? 100 : n.status.health === 'degraded' ? 50 : 0), 0) / Math.max(nodes.length, 1);
    const avgEfficiency = nodes.reduce((sum, n) => sum + n.metrics.efficiency, 0) / Math.max(nodes.length, 1);
    
    return {
      totalCost: Math.round(totalCost),
      totalResources: {
        cpu: totalCpu,
        memory: totalMemory,
        storage: totalStorage,
        network: totalNetwork,
        allocatedCpu,
        allocatedMemory,
        allocatedStorage,
        allocatedNetwork
      },
      applicationCount,
      serviceHealth: Math.round(avgHealth),
      platformMaturity: Math.min(100, nodes.length * 5),
      operationalExcellence: Math.round(avgEfficiency)
    };
  }
}));