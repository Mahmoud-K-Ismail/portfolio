// Graph Data Structure for Neural Network Portfolio Visualization

export type NodeType = 'root' | 'category' | 'item' | 'skill';

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  color: string;
  size: number;
  description?: string;
  details?: {
    title: string;
    subtitle?: string;
    period?: string;
    bullets: string[];
    technologies?: string[];
  };
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Color palette
const colors = {
  root: '#ffffff',
  category: '#3b82f6', // Blue
  item: '#a855f7', // Purple
  skill: '#22c55e', // Green
  skillAlt: '#6b7280', // Gray
};

// Node sizes
const sizes = {
  root: 24,
  category: 16,
  item: 12,
  skill: 8,
};

export const graphData: GraphData = {
  nodes: [
    // Root Node
    {
      id: 'root',
      name: 'Mahmoud Kassem',
      type: 'root',
      color: colors.root,
      size: sizes.root,
      description: 'CS & Applied Mathematics',
      details: {
        title: 'Mahmoud Kassem',
        subtitle: 'Computer Science & Applied Mathematics',
        bullets: [
          'Passionate about AI/ML, NLP, and building intelligent systems',
          'Strong foundation in Applied Mathematics and Algorithm Design',
          'Experience in full-stack development and research',
          'Currently exploring the intersection of language models and software engineering',
        ],
      },
    },

    // Category Nodes
    {
      id: 'experience',
      name: 'Experience',
      type: 'category',
      color: colors.category,
      size: sizes.category,
    },
    {
      id: 'projects',
      name: 'Projects',
      type: 'category',
      color: colors.category,
      size: sizes.category,
    },
    {
      id: 'research',
      name: 'Research',
      type: 'category',
      color: colors.category,
      size: sizes.category,
    },

    // Experience Items
    {
      id: 'monta-ai',
      name: 'Monta AI',
      type: 'item',
      color: colors.item,
      size: sizes.item,
      details: {
        title: 'Monta AI',
        subtitle: 'Software Engineering Intern',
        period: 'Summer 2024',
        bullets: [
          'Developed RAG (Retrieval-Augmented Generation) systems for intelligent document processing',
          'Built scalable pipelines using Azure cloud infrastructure',
          'Implemented vector embeddings and semantic search capabilities',
          'Collaborated with ML engineers to optimize model inference',
        ],
        technologies: ['Python', 'Azure', 'RAG', 'LangChain', 'Vector DBs'],
      },
    },
    {
      id: 'nyu-software-lab',
      name: 'NYU Software Lab',
      type: 'item',
      color: colors.item,
      size: sizes.item,
      details: {
        title: 'NYU Software Lab',
        subtitle: 'Research Assistant',
        period: '2023 - Present',
        bullets: [
          'Researching automated code error generation using GPT-4',
          'Developing benchmarks for evaluating code understanding in LLMs',
          'Contributing to papers on semantic errors in programming',
          'Building tools for software engineering education',
        ],
        technologies: ['Python', 'GPT-4', 'AST Parsing', 'Code Analysis'],
      },
    },
    {
      id: 'camel-lab',
      name: 'CAMeL Lab',
      type: 'item',
      color: colors.item,
      size: sizes.item,
      details: {
        title: 'CAMeL Lab',
        subtitle: 'NLP Research Assistant',
        period: '2022 - 2023',
        bullets: [
          'Worked on Arabic NLP and morphological analysis systems',
          'Contributed to state-of-the-art Arabic language processing tools',
          'Developed annotation pipelines for linguistic data',
          'Published research on Arabic morphology disambiguation',
        ],
        technologies: ['Python', 'NLP', 'Arabic Processing', 'PyTorch'],
      },
    },

    // Project Items
    {
      id: 'notsosimpledb',
      name: 'notSoSimpleDB',
      type: 'item',
      color: colors.item,
      size: sizes.item,
      details: {
        title: 'notSoSimpleDB',
        subtitle: 'Database Engine from Scratch',
        bullets: [
          'Built a fully functional database engine in Java',
          'Implemented B+ tree indexing for efficient queries',
          'Developed SQL parser and query optimizer',
          'Created buffer pool management and transaction logging',
        ],
        technologies: ['Java', 'Data Structures', 'SQL', 'B+ Trees'],
      },
    },
    {
      id: 'navi',
      name: 'Navi',
      type: 'item',
      color: colors.item,
      size: sizes.item,
      details: {
        title: 'Navi',
        subtitle: 'AI Navigation Assistant',
        bullets: [
          'Developed an intelligent navigation assistant using LLMs',
          'Integrated real-time location services and mapping APIs',
          'Built natural language interface for route queries',
          'Implemented context-aware recommendations',
        ],
        technologies: ['Python', 'LLMs', 'APIs', 'React Native'],
      },
    },
    {
      id: 'voucher-finder',
      name: 'Voucher Finder',
      type: 'item',
      color: colors.item,
      size: sizes.item,
      details: {
        title: 'Voucher Finder',
        subtitle: 'Full Stack Web Application',
        bullets: [
          'Built end-to-end web application for discovering deals',
          'Implemented web scraping and data aggregation pipelines',
          'Designed responsive UI with modern frameworks',
          'Deployed with CI/CD and cloud infrastructure',
        ],
        technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      },
    },

    // Research Items
    {
      id: 'icse-2026',
      name: 'ICSE 2026 Paper',
      type: 'item',
      color: colors.item,
      size: sizes.item,
      details: {
        title: 'ICSE 2026 Paper',
        subtitle: 'Semantic Errors in Code',
        period: 'Submitted 2025',
        bullets: [
          'Investigating semantic errors in programming education',
          'Developing automated error injection techniques',
          'Creating benchmarks for code understanding evaluation',
          'Analyzing LLM capabilities in error detection',
        ],
        technologies: ['Research', 'Python', 'LLMs', 'Code Analysis'],
      },
    },
    {
      id: 'qamar',
      name: 'Qamar',
      type: 'item',
      color: colors.item,
      size: sizes.item,
      details: {
        title: 'Qamar',
        subtitle: 'Quranic Annotation Project',
        bullets: [
          'Developing comprehensive Quranic text annotation system',
          'Building morphological and syntactic analysis tools',
          'Creating accessible interfaces for scholarly research',
          'Contributing to Arabic NLP resources',
        ],
        technologies: ['Python', 'NLP', 'Arabic', 'Annotation'],
      },
    },

    // Skill Nodes
    {
      id: 'python',
      name: 'Python',
      type: 'skill',
      color: colors.skill,
      size: sizes.skill,
    },
    {
      id: 'java',
      name: 'Java',
      type: 'skill',
      color: colors.skill,
      size: sizes.skill,
    },
    {
      id: 'react',
      name: 'React',
      type: 'skill',
      color: colors.skill,
      size: sizes.skill,
    },
    {
      id: 'nlp',
      name: 'NLP',
      type: 'skill',
      color: colors.skill,
      size: sizes.skill,
    },
    {
      id: 'azure',
      name: 'Azure',
      type: 'skill',
      color: colors.skillAlt,
      size: sizes.skill,
    },
    {
      id: 'llms',
      name: 'LLMs',
      type: 'skill',
      color: colors.skill,
      size: sizes.skill,
    },
    {
      id: 'sql',
      name: 'SQL',
      type: 'skill',
      color: colors.skillAlt,
      size: sizes.skill,
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      type: 'skill',
      color: colors.skill,
      size: sizes.skill,
    },
  ],

  links: [
    // Root to Categories
    { source: 'root', target: 'experience' },
    { source: 'root', target: 'projects' },
    { source: 'root', target: 'research' },

    // Experience to Items
    { source: 'experience', target: 'monta-ai' },
    { source: 'experience', target: 'nyu-software-lab' },
    { source: 'experience', target: 'camel-lab' },

    // Projects to Items
    { source: 'projects', target: 'notsosimpledb' },
    { source: 'projects', target: 'navi' },
    { source: 'projects', target: 'voucher-finder' },

    // Research to Items
    { source: 'research', target: 'icse-2026' },
    { source: 'research', target: 'qamar' },

    // Skills connections (creating the neural network effect)
    { source: 'monta-ai', target: 'python' },
    { source: 'monta-ai', target: 'azure' },
    { source: 'monta-ai', target: 'llms' },

    { source: 'nyu-software-lab', target: 'python' },
    { source: 'nyu-software-lab', target: 'llms' },

    { source: 'camel-lab', target: 'python' },
    { source: 'camel-lab', target: 'nlp' },

    { source: 'notsosimpledb', target: 'java' },
    { source: 'notsosimpledb', target: 'sql' },

    { source: 'navi', target: 'python' },
    { source: 'navi', target: 'llms' },
    { source: 'navi', target: 'react' },

    { source: 'voucher-finder', target: 'react' },
    { source: 'voucher-finder', target: 'nodejs' },
    { source: 'voucher-finder', target: 'sql' },

    { source: 'icse-2026', target: 'python' },
    { source: 'icse-2026', target: 'llms' },

    { source: 'qamar', target: 'python' },
    { source: 'qamar', target: 'nlp' },

    // Cross-connections between skills (neural network effect)
    { source: 'python', target: 'nlp' },
    { source: 'python', target: 'llms' },
    { source: 'react', target: 'nodejs' },
    { source: 'llms', target: 'nlp' },
  ],
};

// Helper function to get connected nodes
export function getConnectedNodes(nodeId: string): string[] {
  const connected = new Set<string>();
  
  graphData.links.forEach(link => {
    if (link.source === nodeId) {
      connected.add(link.target);
    }
    if (link.target === nodeId) {
      connected.add(link.source);
    }
  });
  
  return Array.from(connected);
}

// Helper function to filter nodes by search term
export function filterNodesBySearch(searchTerm: string): Set<string> {
  const matchingNodes = new Set<string>();
  const term = searchTerm.toLowerCase();
  
  graphData.nodes.forEach(node => {
    if (node.name.toLowerCase().includes(term)) {
      matchingNodes.add(node.id);
      // Add connected nodes
      getConnectedNodes(node.id).forEach(id => matchingNodes.add(id));
    }
  });
  
  return matchingNodes;
}
