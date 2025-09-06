import { 
  SimulationState, 
  GlobalMetrics, 
  PlatformComponent, 
  Issue, 
  IssueType, 
  IssueSeverity,
  ComponentType,
  IssueImpact,
  SecRelCheckpoint,
  CheckpointType
} from '@/types/simulation';

export class SimulationEngine {
  private state: SimulationState;
  private updateCallbacks: ((state: SimulationState) => void)[] = [];

  constructor(initialState: SimulationState) {
    this.state = { ...initialState };
  }

  subscribe(callback: (state: SimulationState) => void) {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  addComponent(component: PlatformComponent) {
    this.state.components.push(component);
    this.updateMetrics();
    this.checkForNewIssues(component);
    this.notifyUpdates();
  }

  removeComponent(componentId: string) {
    this.state.components = this.state.components.filter(c => c.id !== componentId);
    this.state.issues = this.state.issues.filter(i => i.component !== componentId);
    this.updateMetrics();
    this.notifyUpdates();
  }

  updateComponent(componentId: string, updates: Partial<PlatformComponent>) {
    const componentIndex = this.state.components.findIndex(c => c.id === componentId);
    if (componentIndex >= 0) {
      this.state.components[componentIndex] = {
        ...this.state.components[componentIndex],
        ...updates
      };
      this.updateComponentMetrics(this.state.components[componentIndex]);
      this.checkForNewIssues(this.state.components[componentIndex]);
      this.updateMetrics();
      this.notifyUpdates();
    }
  }

  resolveIssue(issueId: string) {
    const issue = this.state.issues.find(i => i.id === issueId);
    if (issue) {
      this.state.issues = this.state.issues.filter(i => i.id !== issueId);
      this.state.totalTime += issue.timeToResolve / 24; // Convert hours to days
      this.updateMetrics();
      this.notifyUpdates();
    }
  }

  private updateMetrics() {
    const components = this.state.components;
    const issues = this.state.issues;

    // Calculate base metrics from components
    const totalComponents = components.length;
    if (totalComponents === 0) {
      this.state.metrics = this.getDefaultMetrics();
      return;
    }

    const avgPerformance = components.reduce((sum, c) => sum + c.metrics.performance, 0) / totalComponents;
    const avgSecurity = components.reduce((sum, c) => sum + c.metrics.security, 0) / totalComponents;
    const avgReliability = components.reduce((sum, c) => sum + c.metrics.reliability, 0) / totalComponents;
    const totalCost = components.reduce((sum, c) => sum + c.metrics.cost, 0);
    const avgComplexity = components.reduce((sum, c) => sum + c.metrics.complexity, 0) / totalComponents;

    // Apply issue impacts
    let userSatisfaction = Math.max(0, avgPerformance - this.getIssueImpact(issues, 'userSatisfaction'));
    let developerVelocity = Math.max(0, 80 - avgComplexity - this.getIssueImpact(issues, 'developerVelocity'));
    let securityScore = Math.max(0, avgSecurity - this.getIssueImpact(issues, 'securityScore'));
    let performanceScore = Math.max(0, avgPerformance - this.getIssueImpact(issues, 'performanceScore'));

    // Calculate derived metrics
    const technicalDebt = Math.min(100, avgComplexity + issues.length * 5);
    const adoptionRate = Math.max(0, userSatisfaction * 0.8 + performanceScore * 0.2);
    const timeToMarket = Math.max(1, this.state.totalTime + issues.length * 0.5);

    this.state.metrics = {
      userSatisfaction: Math.round(userSatisfaction),
      developerVelocity: Math.round(developerVelocity),
      securityScore: Math.round(securityScore),
      technicalDebt: Math.round(technicalDebt),
      performanceScore: Math.round(performanceScore),
      adoptionRate: Math.round(adoptionRate),
      totalCost: Math.round(totalCost),
      timeToMarket: Math.round(timeToMarket * 10) / 10
    };
  }

  private getIssueImpact(issues: Issue[], metric: keyof IssueImpact): number {
    return issues.reduce((total, issue) => {
      const multiplier = this.getSeverityMultiplier(issue.severity);
      return total + (issue.impact[metric] * multiplier);
    }, 0);
  }

  private getSeverityMultiplier(severity: IssueSeverity): number {
    switch (severity) {
      case IssueSeverity.LOW: return 0.5;
      case IssueSeverity.MEDIUM: return 1;
      case IssueSeverity.HIGH: return 2;
      case IssueSeverity.CRITICAL: return 4;
      default: return 1;
    }
  }

  private updateComponentMetrics(component: PlatformComponent) {
    const config = component.config;
    
    // Update security metrics
    let securityScore = 60; // base score
    if (config.security?.encryption) securityScore += 10;
    if (config.security?.authentication) securityScore += 10;
    if (config.security?.authorization) securityScore += 10;
    if (config.security?.inputValidation) securityScore += 5;
    if (config.security?.securityReview) securityScore += 5;

    // Update performance metrics
    let performanceScore = 60; // base score
    if (config.performance?.caching) performanceScore += 15;
    if (config.performance?.compression) performanceScore += 10;
    if (config.performance?.optimizedQueries) performanceScore += 10;
    if (config.performance?.loadBalancing) performanceScore += 5;

    // Update reliability metrics
    let reliabilityScore = 60; // base score
    if (config.reliability?.healthChecks) reliabilityScore += 10;
    if (config.reliability?.monitoring) reliabilityScore += 10;
    if (config.reliability?.backups) reliabilityScore += 15;
    if (config.reliability?.errorHandling) reliabilityScore += 5;

    component.metrics = {
      ...component.metrics,
      security: Math.min(100, securityScore),
      performance: Math.min(100, performanceScore),
      reliability: Math.min(100, reliabilityScore)
    };
  }

  private checkForNewIssues(component: PlatformComponent) {
    const newIssues: Issue[] = [];

    // Security issues
    if (!component.config.security?.securityReview && component.type === ComponentType.API) {
      newIssues.push(this.createIssue(
        IssueType.SECURITY,
        IssueSeverity.HIGH,
        'API without Security Review',
        'This API has not gone through security review, creating potential vulnerabilities.',
        component.id,
        { userSatisfaction: 20, developerVelocity: 0, securityScore: 30, performanceScore: 0, cost: 50000 }
      ));
    }

    if (!component.config.rateLimit && component.type === ComponentType.API) {
      newIssues.push(this.createIssue(
        IssueType.PERFORMANCE,
        IssueSeverity.MEDIUM,
        'No Rate Limiting',
        'API lacks rate limiting, potentially causing performance issues under load.',
        component.id,
        { userSatisfaction: 15, developerVelocity: 5, securityScore: 5, performanceScore: 25, cost: 10000 }
      ));
    }

    // Add issues to state
    this.state.issues.push(...newIssues);
  }

  private createIssue(
    type: IssueType,
    severity: IssueSeverity,
    title: string,
    description: string,
    componentId: string,
    impact: IssueImpact
  ): Issue {
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      severity,
      title,
      description,
      component: componentId,
      impact,
      timeToResolve: this.getTimeToResolve(severity),
      cost: impact.cost
    };
  }

  private getTimeToResolve(severity: IssueSeverity): number {
    switch (severity) {
      case IssueSeverity.LOW: return 4;
      case IssueSeverity.MEDIUM: return 8;
      case IssueSeverity.HIGH: return 24;
      case IssueSeverity.CRITICAL: return 72;
      default: return 8;
    }
  }

  private getDefaultMetrics(): GlobalMetrics {
    return {
      userSatisfaction: 80,
      developerVelocity: 80,
      securityScore: 80,
      technicalDebt: 20,
      performanceScore: 80,
      adoptionRate: 50,
      totalCost: 0,
      timeToMarket: 30
    };
  }

  private notifyUpdates() {
    this.updateCallbacks.forEach(callback => callback(this.state));
  }

  // SecRel Pipeline Methods
  createSecRelCheckpoint(type: CheckpointType, component: PlatformComponent): SecRelCheckpoint {
    const requirements = this.getCheckpointRequirements(type);
    const passed = this.evaluateCheckpoint(type, component);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: this.getCheckpointName(type),
      type,
      required: true,
      passed,
      impact: this.getCheckpointImpact(type, passed),
      requirements
    };
  }

  private getCheckpointRequirements(type: CheckpointType): string[] {
    switch (type) {
      case CheckpointType.SECURITY_REVIEW:
        return ['Security architecture review', 'Vulnerability assessment', 'Access control validation'];
      case CheckpointType.ENGINEERING_REVIEW:
        return ['Code quality check', 'Performance benchmarks', 'Scalability assessment'];
      case CheckpointType.COMPLIANCE_CHECK:
        return ['Data privacy compliance', 'Regulatory requirements', 'Audit trail setup'];
      case CheckpointType.RELIABILITY_TEST:
        return ['Load testing', 'Failure scenario testing', 'Recovery procedures'];
      case CheckpointType.ETHICS_REVIEW:
        return ['Bias assessment', 'Privacy impact analysis', 'Fairness evaluation'];
      case CheckpointType.LEGAL_REVIEW:
        return ['Terms of service', 'Privacy policy', 'Intellectual property clearance'];
      default:
        return [];
    }
  }

  private evaluateCheckpoint(type: CheckpointType, component: PlatformComponent): boolean {
    switch (type) {
      case CheckpointType.SECURITY_REVIEW:
        return component.config.security?.securityReview || false;
      case CheckpointType.ENGINEERING_REVIEW:
        return component.metrics.performance > 70 && component.metrics.reliability > 70;
      case CheckpointType.COMPLIANCE_CHECK:
        return (component.config.security?.encryption || false) && (component.config.security?.authorization || false);
      case CheckpointType.RELIABILITY_TEST:
        return (component.config.reliability?.healthChecks || false) && (component.config.reliability?.monitoring || false);
      default:
        return Math.random() > 0.3; // 70% pass rate for other checkpoints
    }
  }

  private getCheckpointName(type: CheckpointType): string {
    switch (type) {
      case CheckpointType.SECURITY_REVIEW: return 'Security Review';
      case CheckpointType.ENGINEERING_REVIEW: return 'Engineering Review';
      case CheckpointType.COMPLIANCE_CHECK: return 'Compliance Check';
      case CheckpointType.RELIABILITY_TEST: return 'Reliability Test';
      case CheckpointType.ETHICS_REVIEW: return 'Ethics Review';
      case CheckpointType.LEGAL_REVIEW: return 'Legal Review';
      default: return 'Unknown Checkpoint';
    }
  }

  private getCheckpointImpact(type: CheckpointType, passed: boolean): IssueImpact {
    const baseImpact = passed ? 0 : 1;
    
    switch (type) {
      case CheckpointType.SECURITY_REVIEW:
        return {
          userSatisfaction: baseImpact * 25,
          developerVelocity: baseImpact * 10,
          securityScore: baseImpact * 40,
          performanceScore: baseImpact * 5,
          cost: baseImpact * 100000
        };
      case CheckpointType.ENGINEERING_REVIEW:
        return {
          userSatisfaction: baseImpact * 15,
          developerVelocity: baseImpact * 30,
          securityScore: baseImpact * 5,
          performanceScore: baseImpact * 25,
          cost: baseImpact * 75000
        };
      default:
        return {
          userSatisfaction: baseImpact * 10,
          developerVelocity: baseImpact * 5,
          securityScore: baseImpact * 10,
          performanceScore: baseImpact * 5,
          cost: baseImpact * 25000
        };
    }
  }
}