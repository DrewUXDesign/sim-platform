import {
  ComponentLayer,
  InfrastructureType,
  PlatformServiceType,
  RuntimeServiceType,
  ApplicationType,
  PlatformNode
} from '@/types/platform';

export interface NodeTemplate {
  layer: ComponentLayer;
  type: InfrastructureType | PlatformServiceType | RuntimeServiceType | ApplicationType;
  name: string;
  description: string;
  icon: string;
  defaultSize: { width: number; height: number };
  canContain: ComponentLayer[];
  requiresParent: ComponentLayer | null;
  resources?: {
    cpu?: number;
    memory?: number;
    storage?: number;
    network?: number;
  };
  baseCost: number;
}

export const nodeTemplates: NodeTemplate[] = [
  // Infrastructure Layer
  {
    layer: ComponentLayer.INFRASTRUCTURE,
    type: InfrastructureType.REGION,
    name: 'Cloud Region',
    description: 'Geographic deployment region with data centers',
    icon: 'Globe',
    defaultSize: { width: 800, height: 600 },
    canContain: [ComponentLayer.INFRASTRUCTURE, ComponentLayer.PLATFORM],
    requiresParent: null,
    baseCost: 500
  },
  {
    layer: ComponentLayer.INFRASTRUCTURE,
    type: InfrastructureType.COMPUTE,
    name: 'Compute Cluster',
    description: 'Pool of compute resources (VMs/bare metal)',
    icon: 'Server',
    defaultSize: { width: 350, height: 250 },
    canContain: [ComponentLayer.PLATFORM],
    requiresParent: ComponentLayer.INFRASTRUCTURE,
    resources: {
      cpu: 1000,
      memory: 4096,
      storage: 10000,
      network: 10000
    },
    baseCost: 1000
  },
  {
    layer: ComponentLayer.INFRASTRUCTURE,
    type: InfrastructureType.NETWORK,
    name: 'Network Backbone',
    description: 'Core networking infrastructure',
    icon: 'Network',
    defaultSize: { width: 350, height: 100 },
    canContain: [],
    requiresParent: ComponentLayer.INFRASTRUCTURE,
    resources: {
      network: 100000
    },
    baseCost: 300
  },
  {
    layer: ComponentLayer.INFRASTRUCTURE,
    type: InfrastructureType.STORAGE,
    name: 'Storage Array',
    description: 'Persistent storage infrastructure',
    icon: 'HardDrive',
    defaultSize: { width: 200, height: 150 },
    canContain: [],
    requiresParent: ComponentLayer.INFRASTRUCTURE,
    resources: {
      storage: 100000
    },
    baseCost: 200
  },

  // Platform Layer
  {
    layer: ComponentLayer.PLATFORM,
    type: PlatformServiceType.KUBERNETES,
    name: 'Kubernetes Cluster',
    description: 'Container orchestration platform',
    icon: 'Box',
    defaultSize: { width: 300, height: 200 },
    canContain: [ComponentLayer.SERVICE, ComponentLayer.APPLICATION],
    requiresParent: ComponentLayer.INFRASTRUCTURE,
    resources: {
      cpu: 100,
      memory: 512
    },
    baseCost: 150
  },
  {
    layer: ComponentLayer.PLATFORM,
    type: PlatformServiceType.API_GATEWAY,
    name: 'API Gateway',
    description: 'Centralized API management and routing',
    icon: 'GitBranch',
    defaultSize: { width: 250, height: 80 },
    canContain: [],
    requiresParent: ComponentLayer.INFRASTRUCTURE,
    resources: {
      cpu: 50,
      memory: 256,
      network: 1000
    },
    baseCost: 100
  },
  {
    layer: ComponentLayer.PLATFORM,
    type: PlatformServiceType.SERVICE_MESH,
    name: 'Service Mesh',
    description: 'Service-to-service communication layer',
    icon: 'Grid',
    defaultSize: { width: 250, height: 80 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 25,
      memory: 128
    },
    baseCost: 75
  },
  {
    layer: ComponentLayer.PLATFORM,
    type: PlatformServiceType.MESSAGE_BUS,
    name: 'Message Bus',
    description: 'Event streaming and messaging platform',
    icon: 'MessageSquare',
    defaultSize: { width: 200, height: 80 },
    canContain: [],
    requiresParent: ComponentLayer.INFRASTRUCTURE,
    resources: {
      cpu: 50,
      memory: 512,
      storage: 1000
    },
    baseCost: 120
  },
  {
    layer: ComponentLayer.PLATFORM,
    type: PlatformServiceType.CONTAINER_REGISTRY,
    name: 'Container Registry',
    description: 'Docker image storage and distribution',
    icon: 'Package',
    defaultSize: { width: 150, height: 100 },
    canContain: [],
    requiresParent: ComponentLayer.INFRASTRUCTURE,
    resources: {
      storage: 5000
    },
    baseCost: 50
  },

  // Service Layer
  {
    layer: ComponentLayer.SERVICE,
    type: RuntimeServiceType.DATABASE,
    name: 'Database',
    description: 'Managed database service',
    icon: 'Database',
    defaultSize: { width: 120, height: 80 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 100,
      memory: 1024,
      storage: 5000
    },
    baseCost: 200
  },
  {
    layer: ComponentLayer.SERVICE,
    type: RuntimeServiceType.CACHE,
    name: 'Cache',
    description: 'In-memory caching service',
    icon: 'Zap',
    defaultSize: { width: 100, height: 60 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 25,
      memory: 512
    },
    baseCost: 75
  },
  {
    layer: ComponentLayer.SERVICE,
    type: RuntimeServiceType.QUEUE,
    name: 'Message Queue',
    description: 'Async job processing queue',
    icon: 'List',
    defaultSize: { width: 100, height: 60 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 25,
      memory: 256
    },
    baseCost: 50
  },
  {
    layer: ComponentLayer.SERVICE,
    type: RuntimeServiceType.MONITORING,
    name: 'Monitoring',
    description: 'Metrics and observability service',
    icon: 'Activity',
    defaultSize: { width: 120, height: 60 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 50,
      memory: 512,
      storage: 1000
    },
    baseCost: 100
  },
  {
    layer: ComponentLayer.SERVICE,
    type: RuntimeServiceType.AUTHENTICATION,
    name: 'Auth Service',
    description: 'Identity and access management',
    icon: 'Shield',
    defaultSize: { width: 100, height: 60 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 50,
      memory: 256
    },
    baseCost: 80
  },

  // Application Layer
  {
    layer: ComponentLayer.APPLICATION,
    type: ApplicationType.WEB_APP,
    name: 'Web Application',
    description: 'Frontend web application',
    icon: 'Layout',
    defaultSize: { width: 80, height: 60 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 10,
      memory: 128
    },
    baseCost: 20
  },
  {
    layer: ComponentLayer.APPLICATION,
    type: ApplicationType.API_SERVICE,
    name: 'API Service',
    description: 'Backend API microservice',
    icon: 'Code',
    defaultSize: { width: 80, height: 60 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 25,
      memory: 256
    },
    baseCost: 30
  },
  {
    layer: ComponentLayer.APPLICATION,
    type: ApplicationType.WORKER,
    name: 'Worker Service',
    description: 'Background job processor',
    icon: 'Cpu',
    defaultSize: { width: 80, height: 60 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 50,
      memory: 512
    },
    baseCost: 40
  },
  {
    layer: ComponentLayer.APPLICATION,
    type: ApplicationType.CRON_JOB,
    name: 'Scheduled Job',
    description: 'Periodic task runner',
    icon: 'Clock',
    defaultSize: { width: 60, height: 40 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 5,
      memory: 64
    },
    baseCost: 10
  },
  {
    layer: ComponentLayer.APPLICATION,
    type: ApplicationType.FUNCTION,
    name: 'Serverless Function',
    description: 'Event-driven compute function',
    icon: 'Zap',
    defaultSize: { width: 60, height: 40 },
    canContain: [],
    requiresParent: ComponentLayer.PLATFORM,
    resources: {
      cpu: 1,
      memory: 128
    },
    baseCost: 5
  }
];

export function getNodeTemplate(type: string): NodeTemplate | undefined {
  return nodeTemplates.find(t => t.type === type);
}

export function getTemplatesByLayer(layer: ComponentLayer): NodeTemplate[] {
  return nodeTemplates.filter(t => t.layer === layer);
}

export function canContainNode(parent: PlatformNode, childLayer: ComponentLayer): boolean {
  const template = getNodeTemplate(parent.type);
  return template?.canContain.includes(childLayer) || false;
}