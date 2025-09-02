import { create } from 'zustand';
import { SimulationEngine } from '@/lib/simulation-engine';
import { SimulationState, GlobalMetrics, PlatformComponent, Scenario } from '@/types/simulation';

const initialState: SimulationState = {
  components: [],
  metrics: {
    userSatisfaction: 80,
    developerVelocity: 80,
    securityScore: 80,
    technicalDebt: 20,
    performanceScore: 80,
    adoptionRate: 50,
    totalCost: 0,
    timeToMarket: 30
  },
  issues: [],
  secrelCheckpoints: [],
  simulationSpeed: 1,
  isRunning: false,
  totalTime: 0
};

interface SimulationStore extends SimulationState {
  engine: SimulationEngine;
  addComponent: (component: PlatformComponent) => void;
  removeComponent: (componentId: string) => void;
  updateComponent: (componentId: string, updates: Partial<PlatformComponent>) => void;
  resolveIssue: (issueId: string) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  setSpeed: (speed: number) => void;
  loadScenario: (scenario: Scenario) => void;
  clearScenario: () => void;
}

export const useSimulation = create<SimulationStore>((set, get) => {
  const engine = new SimulationEngine(initialState);
  
  // Subscribe to engine updates
  engine.subscribe((newState) => {
    set(newState);
  });

  return {
    ...initialState,
    engine,
    addComponent: (component: PlatformComponent) => {
      engine.addComponent(component);
    },
    removeComponent: (componentId: string) => {
      engine.removeComponent(componentId);
    },
    updateComponent: (componentId: string, updates: Partial<PlatformComponent>) => {
      engine.updateComponent(componentId, updates);
    },
    resolveIssue: (issueId: string) => {
      engine.resolveIssue(issueId);
    },
    startSimulation: () => {
      set({ isRunning: true });
    },
    pauseSimulation: () => {
      set({ isRunning: false });
    },
    setSpeed: (speed: number) => {
      set({ simulationSpeed: speed });
    },
    loadScenario: (scenario: Scenario) => {
      // Reset simulation
      const newEngine = new SimulationEngine({
        ...initialState,
        currentScenario: scenario,
        components: [...scenario.initialComponents]
      });
      
      newEngine.subscribe((newState) => {
        set(newState);
      });
      
      set({ 
        ...initialState,
        engine: newEngine,
        currentScenario: scenario,
        components: [...scenario.initialComponents]
      });
    },
    clearScenario: () => {
      const newEngine = new SimulationEngine(initialState);
      
      newEngine.subscribe((newState) => {
        set(newState);
      });
      
      set({ 
        ...initialState,
        engine: newEngine
      });
    }
  };
});