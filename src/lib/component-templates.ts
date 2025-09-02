import { ComponentTemplate, ComponentType, ComponentConfig, ComponentMetrics } from '@/types/simulation';

export const componentTemplates: ComponentTemplate[] = [
  {
    type: ComponentType.API,
    name: 'REST API',
    description: 'HTTP API endpoint for client communication',
    defaultConfig: {
      rateLimit: 1000,
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
    baseMetrics: {
      performance: 60,
      security: 40,
      reliability: 50,
      cost: 500,
      complexity: 30
    },
    category: 'application'
  },
  {
    type: ComponentType.DATABASE,
    name: 'Database',
    description: 'Primary data storage system',
    defaultConfig: {
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
        backups: false,
        errorHandling: false
      }
    },
    baseMetrics: {
      performance: 70,
      security: 60,
      reliability: 80,
      cost: 800,
      complexity: 40
    },
    category: 'infrastructure'
  },
  {
    type: ComponentType.LOAD_BALANCER,
    name: 'Load Balancer',
    description: 'Distributes traffic across multiple servers',
    defaultConfig: {
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
        loadBalancing: true
      },
      reliability: {
        healthChecks: true,
        monitoring: false,
        backups: false,
        errorHandling: true
      }
    },
    baseMetrics: {
      performance: 85,
      security: 50,
      reliability: 90,
      cost: 300,
      complexity: 25
    },
    category: 'infrastructure'
  },
  {
    type: ComponentType.CACHE,
    name: 'Cache Layer',
    description: 'In-memory data storage for fast access',
    defaultConfig: {
      security: {
        encryption: false,
        authentication: false,
        authorization: false,
        inputValidation: false,
        securityReview: false
      },
      performance: {
        caching: true,
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
    baseMetrics: {
      performance: 95,
      security: 40,
      reliability: 60,
      cost: 200,
      complexity: 20
    },
    category: 'infrastructure'
  },
  {
    type: ComponentType.AUTH_SERVICE,
    name: 'Authentication Service',
    description: 'User authentication and authorization',
    defaultConfig: {
      security: {
        encryption: true,
        authentication: true,
        authorization: true,
        inputValidation: true,
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
        errorHandling: true
      }
    },
    baseMetrics: {
      performance: 70,
      security: 90,
      reliability: 85,
      cost: 400,
      complexity: 50
    },
    category: 'security'
  },
  {
    type: ComponentType.MONITORING,
    name: 'Monitoring System',
    description: 'Application and infrastructure monitoring',
    defaultConfig: {
      security: {
        encryption: false,
        authentication: true,
        authorization: false,
        inputValidation: false,
        securityReview: false
      },
      performance: {
        caching: false,
        compression: true,
        optimizedQueries: false,
        loadBalancing: false
      },
      reliability: {
        healthChecks: true,
        monitoring: true,
        backups: true,
        errorHandling: true
      }
    },
    baseMetrics: {
      performance: 60,
      security: 60,
      reliability: 95,
      cost: 150,
      complexity: 30
    },
    category: 'monitoring'
  },
  {
    type: ComponentType.CDN,
    name: 'Content Delivery Network',
    description: 'Global content distribution and caching',
    defaultConfig: {
      security: {
        encryption: true,
        authentication: false,
        authorization: false,
        inputValidation: false,
        securityReview: false
      },
      performance: {
        caching: true,
        compression: true,
        optimizedQueries: false,
        loadBalancing: true
      },
      reliability: {
        healthChecks: true,
        monitoring: false,
        backups: false,
        errorHandling: true
      }
    },
    baseMetrics: {
      performance: 90,
      security: 70,
      reliability: 85,
      cost: 250,
      complexity: 20
    },
    category: 'infrastructure'
  },
  {
    type: ComponentType.QUEUE,
    name: 'Message Queue',
    description: 'Asynchronous message processing',
    defaultConfig: {
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
        backups: true,
        errorHandling: true
      }
    },
    baseMetrics: {
      performance: 75,
      security: 45,
      reliability: 80,
      cost: 180,
      complexity: 35
    },
    category: 'infrastructure'
  },
  {
    type: ComponentType.MICROSERVICE,
    name: 'Microservice',
    description: 'Independent service component',
    defaultConfig: {
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
    baseMetrics: {
      performance: 65,
      security: 50,
      reliability: 60,
      cost: 350,
      complexity: 45
    },
    category: 'application'
  },
  {
    type: ComponentType.FRONTEND,
    name: 'Frontend Application',
    description: 'User-facing web application',
    defaultConfig: {
      security: {
        encryption: false,
        authentication: false,
        authorization: false,
        inputValidation: true,
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
        errorHandling: true
      }
    },
    baseMetrics: {
      performance: 70,
      security: 60,
      reliability: 70,
      cost: 120,
      complexity: 40
    },
    category: 'application'
  }
];

export function getComponentTemplate(type: ComponentType): ComponentTemplate | undefined {
  return componentTemplates.find(template => template.type === type);
}