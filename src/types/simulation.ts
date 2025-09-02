export interface PlatformComponent {
  id: string;
  type: ComponentType;
  name: string;
  position: { x: number; y: number };
  config: ComponentConfig;
  connections: string[];
  issues: Issue[];
  metrics: ComponentMetrics;
}

export enum ComponentType {
  API = 'api',
  DATABASE = 'database',
  LOAD_BALANCER = 'loadBalancer',
  CACHE = 'cache',
  AUTH_SERVICE = 'authService',
  MONITORING = 'monitoring',
  CDN = 'cdn',
  QUEUE = 'queue',
  MICROSERVICE = 'microservice',
  FRONTEND = 'frontend'
}

export interface ComponentConfig {
  rateLimit?: number;
  caching?: boolean;
  security?: SecurityConfig;
  performance?: PerformanceConfig;
  reliability?: ReliabilityConfig;
}

export interface SecurityConfig {
  encryption: boolean;
  authentication: boolean;
  authorization: boolean;
  inputValidation: boolean;
  securityReview: boolean;
}

export interface PerformanceConfig {
  caching: boolean;
  compression: boolean;
  optimizedQueries: boolean;
  loadBalancing: boolean;
}

export interface ReliabilityConfig {
  healthChecks: boolean;
  monitoring: boolean;
  backups: boolean;
  errorHandling: boolean;
}

export interface ComponentMetrics {
  performance: number; // 0-100
  security: number; // 0-100
  reliability: number; // 0-100
  cost: number; // Monthly cost in $
  complexity: number; // 0-100
}

export interface GlobalMetrics {
  userSatisfaction: number; // 0-100
  developerVelocity: number; // 0-100
  securityScore: number; // 0-100
  technicalDebt: number; // 0-100
  performanceScore: number; // 0-100
  adoptionRate: number; // 0-100
  totalCost: number;
  timeToMarket: number; // days
}

export interface Issue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  component: string;
  impact: IssueImpact;
  timeToResolve: number; // hours
  cost: number; // $ to fix
}

export enum IssueType {
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  RELIABILITY = 'reliability',
  COMPLIANCE = 'compliance',
  SCALABILITY = 'scalability',
  TECHNICAL_DEBT = 'technicalDebt'
}

export enum IssueSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface IssueImpact {
  userSatisfaction: number;
  developerVelocity: number;
  securityScore: number;
  performanceScore: number;
  cost: number;
}

export interface SecRelCheckpoint {
  id: string;
  name: string;
  type: CheckpointType;
  required: boolean;
  passed: boolean;
  impact: IssueImpact;
  requirements: string[];
}

export enum CheckpointType {
  SECURITY_REVIEW = 'securityReview',
  ENGINEERING_REVIEW = 'engineeringReview',
  COMPLIANCE_CHECK = 'complianceCheck',
  RELIABILITY_TEST = 'reliabilityTest',
  ETHICS_REVIEW = 'ethicsReview',
  LEGAL_REVIEW = 'legalReview'
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  initialComponents: PlatformComponent[];
  objectives: ScenarioObjective[];
  timeLimit?: number; // minutes
  budget?: number;
}

export interface ScenarioObjective {
  id: string;
  description: string;
  targetMetric: keyof GlobalMetrics;
  targetValue: number;
  weight: number; // for scoring
}

export interface SimulationState {
  components: PlatformComponent[];
  metrics: GlobalMetrics;
  issues: Issue[];
  secrelCheckpoints: SecRelCheckpoint[];
  currentScenario?: Scenario;
  simulationSpeed: number; // 1x, 2x, 4x
  isRunning: boolean;
  totalTime: number; // simulation time in days
}

export interface ComponentTemplate {
  type: ComponentType;
  name: string;
  description: string;
  defaultConfig: ComponentConfig;
  baseMetrics: ComponentMetrics;
  category: 'infrastructure' | 'application' | 'security' | 'monitoring';
}