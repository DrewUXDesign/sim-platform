import { TutorialStep } from '@/components/TutorialOverlay';

export const guidedTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Cloud Platform! ☁️',
    description: 'Great choice! We\'re going to build your first cloud platform together. Think of this as building with digital LEGO blocks!',
    explanation: 'A cloud platform is like a digital city where websites and apps can live. Just like a city needs roads, buildings, and utilities, your digital platform needs different components to work properly.',
    action: 'observe',
    position: 'center'
  },
  {
    id: 'understand-region',
    title: 'Meet Your Region 🌍',
    description: 'See that big box on the screen? That\'s your "Region" - it\'s already there waiting for you!',
    explanation: 'Think of a Region like a neighborhood where all your digital stuff lives. Just like you might live in "Downtown" or "Suburbs", your apps live in regions like "US-East" or "Europe". Everything you build will go inside this neighborhood.',
    action: 'observe',
    position: 'left'
  },
  {
    id: 'add-availability-zone',
    title: 'Adding Your First Building Block 🏢',
    description: 'Perfect! I\'ve just added an "Availability Zone" to your region. Watch as it appears on your canvas!',
    explanation: 'An Availability Zone is like a building in your neighborhood. If one building has problems (like a power outage), the other buildings keep working! This makes your platform super reliable - like having backup generators.',
    action: 'observe',
    component: 'Availability Zone',
    position: 'right'
  },
  {
    id: 'add-compute',
    title: 'Adding Some Muscle Power 💪',
    description: 'Excellent! Now I\'m adding a "Compute Instance" to your Availability Zone. This is where the real work happens!',
    explanation: 'A Compute Instance is like hiring a super-fast worker for your digital business. This worker can handle calculations, run your website, process orders - basically the "brain power" of your platform. More compute = more workers = more things you can do!',
    action: 'observe',
    component: 'Compute Instance',
    position: 'right'
  },
  {
    id: 'add-database',
    title: 'Adding a Memory Bank 🧠',
    description: 'Fantastic! I\'m now adding a "Database" to store important information. See it appear in your Availability Zone!',
    explanation: 'A Database is like a super-organized filing cabinet that never forgets anything. It stores all your important information: user accounts, messages, photos, orders - everything! Without it, your platform would have amnesia and forget everything every time you restart.',
    action: 'observe',
    component: 'Database',
    position: 'right'
  },
  {
    id: 'add-load-balancer',
    title: 'Adding Traffic Control 🚦',
    description: 'Great! I\'m adding a "Load Balancer" to help manage visitors to your platform. Watch it appear!',
    explanation: 'A Load Balancer is like a smart traffic cop at a busy intersection. When lots of people try to use your app at once, it directs them to different "lanes" (servers) so nobody gets stuck waiting. It keeps everything running smoothly even when you\'re popular!',
    action: 'observe',
    component: 'Load Balancer',
    position: 'right'
  },
  {
    id: 'add-application',
    title: 'Deploy Your First App 📱',
    description: 'Time for the exciting part! Let\'s add an actual "Web Application" that people will use. Look for it under "Applications" in the left panel.',
    explanation: 'This is your actual app - like Instagram, Netflix, or your favorite game! It\'s what users will see and interact with. All those other components we added? They\'re the "behind-the-scenes" workers that make this app run fast and reliably.',
    action: 'drag',
    component: 'Web Application',
    position: 'right'
  },
  {
    id: 'check-metrics',
    title: 'Watch Your Platform Come to Life 📊',
    description: 'Look at the right panel - see all those numbers and charts? That\'s your platform\'s "vital signs"!',
    explanation: 'Those metrics are like a health monitor for your platform. They show you how much "brain power" (CPU), "memory" (RAM), and "storage space" you\'re using. Green numbers = healthy platform. If they turn red, it means you need more powerful components!',
    action: 'observe',
    position: 'left'
  },
  {
    id: 'simulation-ready',
    title: 'Ready to See Magic Happen? ✨',
    description: 'Click the green "Simulate" button at the top to bring your platform to life! Watch the numbers change as your platform starts working.',
    explanation: 'Simulation is like pressing "play" on your digital city. Your compute workers start working, your database starts storing information, and your load balancer starts directing traffic. It\'s like watching your LEGO creation actually come to life and do real work!',
    action: 'click',
    component: 'Simulate button',
    position: 'center'
  },
  {
    id: 'congratulations',
    title: 'You Did It! 🎉',
    description: 'Congratulations! You\'ve just built your first cloud platform. You now understand the basics of how the internet works behind the scenes!',
    explanation: 'What you built is similar to what companies like Netflix, Instagram, and Amazon use to serve millions of users. You started with basic building blocks and created a full platform that can host real applications. Pretty amazing, right?',
    action: 'observe',
    position: 'center'
  }
];

export const componentExplanations = {
  'Region': {
    simple: 'A neighborhood where all your digital stuff lives',
    detailed: 'A geographic area that contains all your platform components. Like choosing to build in New York vs Tokyo.'
  },
  'Availability Zone': {
    simple: 'A reliable building in your digital neighborhood',
    detailed: 'An isolated location within a region that provides redundancy and fault tolerance.'
  },
  'Compute Instance': {
    simple: 'A super-fast digital worker that does the thinking',
    detailed: 'Virtual machines that provide processing power for running applications and services.'
  },
  'Database': {
    simple: 'A filing cabinet that never forgets anything',
    detailed: 'Organized storage for structured data with fast search and retrieval capabilities.'
  },
  'Load Balancer': {
    simple: 'A traffic cop that keeps everything flowing smoothly',
    detailed: 'Distributes incoming requests across multiple servers to prevent overload.'
  },
  'Web Application': {
    simple: 'The actual app that people use and see',
    detailed: 'The user-facing application that provides functionality to end users.'
  }
};