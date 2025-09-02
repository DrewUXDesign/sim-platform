import { Scenario, ComponentType, PlatformComponent } from '@/types/simulation';

export const scenarios: Scenario[] = [
  {
    id: 'getting-started',
    title: 'Getting Started: Build Your First API',
    description: 'Learn the basics of platform development by building a simple API and understanding how it affects your metrics.',
    difficulty: 'beginner',
    initialComponents: [],
    objectives: [
      {
        id: 'create-api',
        description: 'Add a REST API component to your platform',
        targetMetric: 'performanceScore',
        targetValue: 60,
        weight: 0.3
      },
      {
        id: 'keep-security',
        description: 'Maintain security score above 50%',
        targetMetric: 'securityScore',
        targetValue: 50,
        weight: 0.3
      },
      {
        id: 'user-satisfaction',
        description: 'Achieve user satisfaction of at least 70%',
        targetMetric: 'userSatisfaction',
        targetValue: 70,
        weight: 0.4
      }
    ],
    timeLimit: 15,
    budget: 2000
  },
  {
    id: 'security-crisis',
    title: 'Security Crisis: Secure Your Platform',
    description: 'Your platform has security vulnerabilities! Learn how to implement proper security measures and pass security reviews.',
    difficulty: 'intermediate',
    initialComponents: [
      {
        id: 'vulnerable-api',
        type: ComponentType.API,
        name: 'Vulnerable API',
        position: { x: 200, y: 150 },
        config: {
          rateLimit: 10000,
          security: {
            encryption: false,
            authentication: false,
            authorization: false,
            inputValidation: false,
            securityReview: false
          },
          performance: {
            caching: false,
            compression: false,
            optimizedQueries: false,
            loadBalancing: false
          },
          reliability: {
            healthChecks: false,
            monitoring: false,
            backups: false,
            errorHandling: false
          }
        },
        connections: [],
        issues: [],
        metrics: {
          performance: 60,
          security: 20,
          reliability: 40,
          cost: 500,
          complexity: 30
        }
      }
    ],
    objectives: [
      {
        id: 'fix-security',
        description: 'Achieve security score above 80%',
        targetMetric: 'securityScore',
        targetValue: 80,
        weight: 0.5
      },
      {
        id: 'pass-security-review',
        description: 'Pass security review checkpoint',
        targetMetric: 'userSatisfaction',
        targetValue: 75,
        weight: 0.3
      },
      {
        id: 'maintain-performance',
        description: 'Keep performance score above 65%',
        targetMetric: 'performanceScore',
        targetValue: 65,
        weight: 0.2
      }
    ],
    timeLimit: 25,
    budget: 5000
  },
  {
    id: 'scaling-challenge',
    title: 'Scaling Challenge: Handle the Traffic Spike',
    description: 'Your platform is getting popular! Learn how to scale your infrastructure to handle increased traffic while maintaining performance.',
    difficulty: 'intermediate',
    initialComponents: [
      {
        id: 'basic-api',
        type: ComponentType.API,
        name: 'Basic API',
        position: { x: 150, y: 100 },
        config: {
          rateLimit: 100,
          security: {
            encryption: true,
            authentication: true,
            authorization: false,
            inputValidation: true,
            securityReview: true
          },
          performance: {
            caching: false,
            compression: false,
            optimizedQueries: false,
            loadBalancing: false
          },
          reliability: {
            healthChecks: false,
            monitoring: false,
            backups: false,
            errorHandling: true
          }
        },
        connections: [],
        issues: [],
        metrics: {
          performance: 45,
          security: 80,
          reliability: 55,
          cost: 500,
          complexity: 30
        }
      },
      {
        id: 'basic-db',
        type: ComponentType.DATABASE,
        name: 'Database',
        position: { x: 150, y: 250 },
        config: {
          security: {
            encryption: false,
            authentication: true,
            authorization: false,
            inputValidation: false,
            securityReview: false
          },
          performance: {
            caching: false,
            compression: false,
            optimizedQueries: false,
            loadBalancing: false
          },
          reliability: {
            healthChecks: false,
            monitoring: false,
            backups: true,
            errorHandling: false
          }
        },
        connections: [],
        issues: [],
        metrics: {
          performance: 50,
          security: 60,
          reliability: 70,
          cost: 800,
          complexity: 40
        }
      }
    ],
    objectives: [
      {
        id: 'improve-performance',
        description: 'Achieve performance score above 85%',
        targetMetric: 'performanceScore',
        targetValue: 85,
        weight: 0.4
      },
      {
        id: 'high-user-satisfaction',
        description: 'Reach user satisfaction of 85%',
        targetMetric: 'userSatisfaction',
        targetValue: 85,
        weight: 0.3
      },
      {
        id: 'control-costs',
        description: 'Keep monthly costs under $3000',
        targetMetric: 'totalCost',
        targetValue: 3000,
        weight: 0.3
      }
    ],
    timeLimit: 30,
    budget: 4000
  },
  {
    id: 'enterprise-platform',
    title: 'Enterprise Platform: Build for Scale',
    description: 'Build a comprehensive enterprise platform with all the bells and whistles - monitoring, caching, load balancing, and more!',
    difficulty: 'advanced',
    initialComponents: [],
    objectives: [
      {
        id: 'comprehensive-architecture',
        description: 'Deploy at least 6 different component types',
        targetMetric: 'performanceScore',
        targetValue: 90,
        weight: 0.2
      },
      {
        id: 'excellent-performance',
        description: 'Achieve performance score above 90%',
        targetMetric: 'performanceScore',
        targetValue: 90,
        weight: 0.25
      },
      {
        id: 'top-security',
        description: 'Maintain security score above 95%',
        targetMetric: 'securityScore',
        targetValue: 95,
        weight: 0.25
      },
      {
        id: 'high-reliability',
        description: 'Achieve user satisfaction above 90%',
        targetMetric: 'userSatisfaction',
        targetValue: 90,
        weight: 0.2
      },
      {
        id: 'low-tech-debt',
        description: 'Keep technical debt below 15%',
        targetMetric: 'technicalDebt',
        targetValue: 15,
        weight: 0.1
      }
    ],
    timeLimit: 45,
    budget: 10000
  },
  {
    id: 'cost-optimization',
    title: 'Cost Optimization: Do More with Less',
    description: 'You have budget constraints! Build an effective platform while keeping costs under control.',
    difficulty: 'intermediate',
    initialComponents: [],
    objectives: [
      {
        id: 'performance-target',
        description: 'Achieve performance score above 75%',
        targetMetric: 'performanceScore',
        targetValue: 75,
        weight: 0.3
      },
      {
        id: 'security-target',
        description: 'Maintain security score above 70%',
        targetMetric: 'securityScore',
        targetValue: 70,
        weight: 0.3
      },
      {
        id: 'strict-budget',
        description: 'Keep monthly costs under $1500',
        targetMetric: 'totalCost',
        targetValue: 1500,
        weight: 0.4
      }
    ],
    timeLimit: 20,
    budget: 2500
  },
  {
    id: 'incident-response',
    title: 'Incident Response: Fix the Outage',
    description: 'Your platform is down! Multiple critical issues need immediate attention. Learn to prioritize and resolve problems quickly.',
    difficulty: 'advanced',
    initialComponents: [
      {
        id: 'failing-api',
        type: ComponentType.API,
        name: 'Failing API',
        position: { x: 100, y: 100 },
        config: {
          rateLimit: 50,
          security: {
            encryption: false,
            authentication: false,
            authorization: false,
            inputValidation: false,
            securityReview: false
          },
          performance: {
            caching: false,
            compression: false,
            optimizedQueries: false,
            loadBalancing: false
          },
          reliability: {
            healthChecks: false,
            monitoring: false,
            backups: false,
            errorHandling: false
          }
        },
        connections: [],
        issues: [],
        metrics: {
          performance: 25,
          security: 20,
          reliability: 30,
          cost: 500,
          complexity: 60
        }
      },
      {
        id: 'unstable-db',
        type: ComponentType.DATABASE,
        name: 'Unstable Database',
        position: { x: 300, y: 150 },
        config: {
          security: {
            encryption: false,
            authentication: false,
            authorization: false,
            inputValidation: false,
            securityReview: false
          },
          performance: {
            caching: false,
            compression: false,
            optimizedQueries: false,
            loadBalancing: false
          },
          reliability: {
            healthChecks: false,
            monitoring: false,
            backups: false,
            errorHandling: false
          }
        },
        connections: [],
        issues: [],
        metrics: {
          performance: 30,
          security: 25,
          reliability: 20,
          cost: 800,
          complexity: 70
        }
      }
    ],
    objectives: [
      {
        id: 'restore-service',
        description: 'Achieve user satisfaction above 60%',
        targetMetric: 'userSatisfaction',
        targetValue: 60,
        weight: 0.4
      },
      {
        id: 'improve-reliability',
        description: 'Get performance score above 70%',
        targetMetric: 'performanceScore',
        targetValue: 70,
        weight: 0.3
      },
      {
        id: 'quick-recovery',
        description: 'Complete recovery in under 20 minutes',
        targetMetric: 'developerVelocity',
        targetValue: 50,
        weight: 0.3
      }
    ],
    timeLimit: 20,
    budget: 3000
  }
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find(scenario => scenario.id === id);
}

export function getScenariosByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Scenario[] {
  return scenarios.filter(scenario => scenario.difficulty === difficulty);
}