export enum ComponentLayer {
  INFRASTRUCTURE = 'infrastructure',
  PLATFORM = 'platform',
  SERVICE = 'service',
  APPLICATION = 'application'
}

export enum InfrastructureType {
  COMPUTE = 'compute',
  NETWORK = 'network',
  STORAGE = 'storage',
  REGION = 'region'
}

export enum PlatformServiceType {
  KUBERNETES = 'kubernetes',
  CONTAINER_REGISTRY = 'containerRegistry',
  API_GATEWAY = 'apiGateway',
  SERVICE_MESH = 'serviceMesh',
  MESSAGE_BUS = 'messageBus',
  SECRETS_MANAGER = 'secretsManager'
}

export enum RuntimeServiceType {
  DATABASE = 'database',
  CACHE = 'cache',
  QUEUE = 'queue',
  MONITORING = 'monitoring',
  LOGGING = 'logging',
  AUTHENTICATION = 'authentication'
}

export enum ApplicationType {
  WEB_APP = 'webApp',
  API_SERVICE = 'apiService',
  WORKER = 'worker',
  CRON_JOB = 'cronJob',
  FUNCTION = 'function'
}

export interface ResourceRequirements {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

export interface ResourceCapacity extends ResourceRequirements {
  allocatedCpu: number;
  allocatedMemory: number;
  allocatedStorage: number;
  allocatedNetwork: number;
}

export interface PlatformNode {
  id: string;
  layer: ComponentLayer;
  type: InfrastructureType | PlatformServiceType | RuntimeServiceType | ApplicationType;
  name: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  parentId?: string;
  childIds: string[];
  resources?: ResourceRequirements | ResourceCapacity;
  config: {
    replicas?: number;
    autoScaling?: boolean;
    minReplicas?: number;
    maxReplicas?: number;
    healthCheck?: boolean;
    monitoring?: boolean;
    logging?: boolean;
  };
  status: {
    health: 'healthy' | 'degraded' | 'unhealthy';
    utilization: number;
    incidents: number;
    latency: number;
  };
  metrics: {
    availability: number;
    performance: number;
    cost: number;
    efficiency: number;
  };
}

export interface Deployment {
  id: string;
  applicationId: string;
  targetId: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  status: 'pending' | 'deploying' | 'running' | 'failed';
  replicas: number;
  resources: ResourceRequirements;
  created: Date;
  updated: Date;
}

export interface Traffic {
  requestsPerSecond: number;
  averageLatency: number;
  errorRate: number;
  throughput: number;
}

export interface PlatformState {
  nodes: Map<string, PlatformNode>;
  deployments: Deployment[];
  traffic: Traffic;
  globalMetrics: {
    totalCost: number;
    totalResources: ResourceCapacity;
    applicationCount: number;
    serviceHealth: number;
    platformMaturity: number;
    operationalExcellence: number;
  };
}