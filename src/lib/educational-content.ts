export interface EducationalContent {
  concept: string;
  explanation: string;
  analogy?: string;
  learnMore?: string;
  impacts: string[];
  bestPractices: string[];
}

export const educationalContent: Record<string, EducationalContent> = {
  // Platform Components
  api: {
    concept: "REST API",
    explanation: "An API (Application Programming Interface) is like a waiter in a restaurant - it takes requests from customers (users) and brings back responses from the kitchen (your system).",
    analogy: "A waiter who takes your order and brings your food back. The waiter doesn't cook the food, but knows how to communicate between you and the kitchen.",
    learnMore: "APIs are the building blocks of modern web applications, allowing different services to communicate with each other.",
    impacts: ["Affects user experience through response times", "Security vulnerabilities can expose sensitive data", "Poor rate limiting can cause system overload"],
    bestPractices: ["Always implement rate limiting", "Use HTTPS encryption", "Add input validation", "Include proper error handling"]
  },

  database: {
    concept: "Database",
    explanation: "A database is like a giant, organized filing cabinet that stores all your information and can quickly find what you need.",
    analogy: "A super-smart filing cabinet that can instantly find any document you ask for, no matter how many millions of files it contains.",
    learnMore: "Databases are where all your application data lives - user accounts, posts, settings, everything!",
    impacts: ["Slow queries affect user experience", "Data breaches can expose private information", "Downtime means users can't access their data"],
    bestPractices: ["Enable encryption at rest", "Set up regular backups", "Monitor query performance", "Implement access controls"]
  },

  loadBalancer: {
    concept: "Load Balancer",
    explanation: "A load balancer is like a traffic director at a busy intersection, making sure cars (user requests) go to the least busy road (server).",
    analogy: "A smart traffic cop who sees which checkout lines at the grocery store are shortest and directs customers there to avoid long waits.",
    learnMore: "Load balancers help your application handle more users by distributing the work across multiple servers.",
    impacts: ["Prevents any single server from getting overwhelmed", "Improves response times for users", "Provides backup if one server fails"],
    bestPractices: ["Configure health checks", "Use sticky sessions when needed", "Monitor server performance", "Plan for automatic failover"]
  },

  cache: {
    concept: "Cache",
    explanation: "A cache is like keeping your most-used items on your desk instead of in a filing cabinet - much faster to grab when you need them!",
    analogy: "Like keeping snacks in your desk drawer instead of walking to the kitchen every time you're hungry.",
    learnMore: "Caches dramatically improve performance by storing frequently-accessed data in super-fast memory.",
    impacts: ["Dramatically reduces response times", "Reduces load on databases and APIs", "Can serve stale data if not managed properly"],
    bestPractices: ["Set appropriate expiration times", "Implement cache invalidation", "Monitor cache hit rates", "Plan for cache failures"]
  },

  authService: {
    concept: "Authentication Service",
    explanation: "An auth service is like the bouncer at a club - it checks if you're on the list and gives you a wristband to prove you belong inside.",
    analogy: "The security guard who checks your ID at the airport and gives you a boarding pass that proves you're allowed on the plane.",
    learnMore: "Authentication services verify who users are and what they're allowed to do in your application.",
    impacts: ["Protects sensitive user data", "Prevents unauthorized access", "Poor implementation can expose all user accounts"],
    bestPractices: ["Use strong password requirements", "Enable multi-factor authentication", "Encrypt user credentials", "Log security events"]
  },

  monitoring: {
    concept: "Monitoring System",
    explanation: "Monitoring is like having a health tracker for your application - it watches everything and alerts you when something looks wrong.",
    analogy: "Like a fitness watch that tracks your heart rate, steps, and sleep, and buzzes when something needs attention.",
    learnMore: "Monitoring helps you catch problems before users notice them and understand how your system performs.",
    impacts: ["Helps prevent downtime", "Identifies performance problems early", "Provides data for capacity planning"],
    bestPractices: ["Monitor key metrics", "Set up alerting", "Create dashboards", "Track user experience metrics"]
  },

  // Metrics
  userSatisfaction: {
    concept: "User Satisfaction",
    explanation: "User satisfaction measures how happy your users are with your platform - like a report card from your customers.",
    analogy: "Like restaurant reviews - if food is slow, cold, or the service is bad, customers leave poor reviews and don't come back.",
    learnMore: "Happy users stay longer, use more features, and recommend your platform to others.",
    impacts: ["Affects user retention and growth", "Influences revenue and business success", "Poor satisfaction leads to user churn"],
    bestPractices: ["Monitor page load times", "Fix bugs quickly", "Gather user feedback", "Prioritize user experience"]
  },

  developerVelocity: {
    concept: "Developer Velocity",
    explanation: "Developer velocity is how fast your team can build and ship new features - like measuring how quickly a construction crew can build a house.",
    analogy: "Like a race car pit crew - the faster they can change tires and refuel, the quicker the car gets back on track.",
    learnMore: "Higher velocity means faster time-to-market and quicker response to user needs.",
    impacts: ["Affects competitive advantage", "Influences time-to-market", "Higher complexity slows down development"],
    bestPractices: ["Reduce technical debt", "Automate testing", "Simplify architecture", "Provide good tooling"]
  },

  securityScore: {
    concept: "Security Score",
    explanation: "Your security score is like a report card for how well-protected your platform is from hackers and data breaches.",
    analogy: "Like the security rating of your house - locks on doors, alarm system, security cameras, and strong windows all improve your score.",
    learnMore: "Higher security scores mean lower risk of costly breaches and better user trust.",
    impacts: ["Prevents data breaches and financial losses", "Builds user trust", "Meets compliance requirements"],
    bestPractices: ["Encrypt sensitive data", "Use secure authentication", "Regular security audits", "Keep software updated"]
  },

  technicalDebt: {
    concept: "Technical Debt",
    explanation: "Technical debt is like taking shortcuts when building - it's faster now, but you'll pay extra time and money to fix it later.",
    analogy: "Like building a house with cheaper materials to save money upfront, but then spending more on repairs and maintenance later.",
    learnMore: "Too much technical debt slows down development and makes the system harder to maintain.",
    impacts: ["Slows down new feature development", "Increases maintenance costs", "Makes bugs more likely"],
    bestPractices: ["Regular code refactoring", "Automated testing", "Code reviews", "Documentation"]
  },

  // SecRel Pipeline
  secrelPipeline: {
    concept: "SecRel Pipeline",
    explanation: "A SecRel pipeline is like a quality control checklist that every new feature must pass before it goes live - checking Security, Engineering, Compliance, Reliability, Ethics, and Legal requirements.",
    analogy: "Like the safety inspections a new car must pass before it can be sold - checking brakes, airbags, emissions, and more.",
    learnMore: "SecRel pipelines prevent problems from reaching users by catching issues early in development.",
    impacts: ["Prevents security vulnerabilities in production", "Ensures compliance with regulations", "Improves overall system reliability"],
    bestPractices: ["Automate checks where possible", "Make pipeline fast to avoid blocking development", "Clear documentation of requirements", "Regular pipeline updates"]
  },

  securityReview: {
    concept: "Security Review",
    explanation: "A security review is like having a security expert examine your system for weak spots that hackers might exploit.",
    analogy: "Like having a professional burglar (the good kind!) check your house for weak locks, hidden keys, and ways someone could break in.",
    learnMore: "Security reviews catch vulnerabilities before attackers can exploit them.",
    impacts: ["Prevents data breaches", "Protects user privacy", "Avoids costly security incidents"],
    bestPractices: ["Regular automated security scanning", "Manual code reviews", "Penetration testing", "Security training for developers"]
  },

  // Issues
  rateLimit: {
    concept: "Rate Limiting",
    explanation: "Rate limiting is like having a speed limit for how many requests users can make - it prevents any single user from overloading your system.",
    analogy: "Like a theme park limiting how many times you can ride the roller coaster per hour so everyone gets a fair turn.",
    learnMore: "Without rate limiting, malicious users or bugs can overwhelm your servers with too many requests.",
    impacts: ["Prevents system overload", "Ensures fair access for all users", "Protects against denial-of-service attacks"],
    bestPractices: ["Set appropriate limits per user", "Provide clear error messages", "Monitor usage patterns", "Implement graceful degradation"]
  }
};

export function getEducationalContent(key: string): EducationalContent | undefined {
  return educationalContent[key.toLowerCase()];
}