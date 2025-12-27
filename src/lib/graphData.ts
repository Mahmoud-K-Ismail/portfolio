// Graph Data Structure with your actual resume content

export type NodeType = 'root' | 'category' | 'item' | 'skill';

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  color: string;
  size: number;
  parentId?: string; // For expand/collapse
  description?: string;
  image?: string; // Path to image/logo
  icon?: string; // Icon name for lucide-react
  details?: {
    title: string;
    subtitle?: string;
    period?: string;
    location?: string;
    bullets: string[];
    technologies?: string[];
    links?: { label: string; url: string }[];
    image?: string; // Image for detail panel
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

// Color palette - vibrant and distinct
const colors = {
  root: '#ffffff',
  experience: '#3b82f6',    // Blue
  projects: '#8b5cf6',      // Purple
  research: '#ec4899',      // Pink
  education: '#f59e0b',     // Amber
  skills: '#10b981',        // Emerald
  item: '#94a3b8',          // Slate
};

export const graphData: GraphData = {
  nodes: [
    // ═══════════════════════════════════════
    // ROOT NODE
    // ═══════════════════════════════════════
    {
      id: 'root',
      name: 'Mahmoud Kassem',
      type: 'root',
      color: colors.root,
      size: 28,
      description: 'CS & Applied Math @ NYU',
      image: '/202510-30-NYUAD_mki4895-0785-RetSquare.jpg',
      details: {
        title: 'Mahmoud Kassem',
        subtitle: 'Computer Science & Applied Mathematics',
        period: 'Graduating May 2026',
        location: 'NYU Abu Dhabi',
        image: '/202510-30-NYUAD_mki4895-0785-RetSquare.jpg',
        bullets: [
          'Building scalable distributed systems and cloud-native applications',
          'Expertise in Java, Python, and microservices architecture',
          'Strong foundation in data structures, algorithms, and system design',
          'GPA: 3.89/4.0 | Major GPA: 3.93/4.0',
        ],
        links: [
          { label: 'GitHub', url: 'https://github.com/Mahmoud-K-Ismail' },
          { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mahmoud-Kassem-b02338263/' },
          { label: 'Resume PDF', url: '/resume.pdf' },
        ],
      },
    },

    // ═══════════════════════════════════════
    // CATEGORY NODES
    // ═══════════════════════════════════════
    {
      id: 'experience',
      name: 'Experience',
      type: 'category',
      color: colors.experience,
      size: 20,
      icon: 'Briefcase',
    },
    {
      id: 'projects',
      name: 'Projects',
      type: 'category',
      color: colors.projects,
      size: 20,
      icon: 'FolderKanban',
    },
    {
      id: 'research',
      name: 'Research',
      type: 'category',
      color: colors.research,
      size: 20,
      icon: 'Microscope',
      image: '/download.png',
    },
    {
      id: 'skills',
      name: 'Skills',
      type: 'category',
      color: colors.skills,
      size: 20,
      icon: 'Code',
    },
    {
      id: 'education',
      name: 'Education',
      type: 'category',
      color: colors.education,
      size: 20,
      icon: 'GraduationCap',
      image: '/Gemini_Generated_Image_ikf4c9ikf4c9ikf4 (1).png',
    },
    {
      id: 'resume',
      name: 'Resume',
      type: 'item',
      color: '#f59e0b',
      size: 18,
      details: {
        title: 'Resume PDF',
        subtitle: 'Download my full resume',
        bullets: [
          'Complete professional experience and education history',
          'Detailed project descriptions and technologies used',
          'Research publications and academic achievements',
          'Technical skills and certifications',
        ],
        links: [
          { label: 'Download PDF', url: '/resume.pdf' },
        ],
      },
    },

    // ═══════════════════════════════════════
    // EXPERIENCE ITEMS
    // ═══════════════════════════════════════
    {
      id: 'monta-ai',
      name: 'Monta AI',
      type: 'item',
      color: colors.experience,
      size: 14,
      parentId: 'experience',
      image: '/monta_logo.png',
      details: {
        title: 'Monta AI',
        subtitle: 'AI Engineer Intern',
        period: 'Sep 2025 – Present',
        location: 'San Francisco, CA (Remote)',
        image: '/monta_logo.png',
        bullets: [
          'Engineering production RAG system using FastAPI on Azure to convert complex construction data (BIM models, IFC files) into queryable knowledge bases, reducing document lookup time by 70%',
          'Developed parsing pipelines using LlamaIndex and Ollama to extract structured logic from technical documents, mitigating hallucination risks in high-stakes compliance contexts',
          'Implemented comprehensive error handling and monitoring for distributed API endpoints, enabling real-time issue detection across production environments',
        ],
        technologies: ['FastAPI', 'Azure', 'LlamaIndex', 'Ollama', 'RAG', 'Python'],
        links: [{ label: 'Company', url: 'https://www.monta.ai/' }],
      },
    },
    {
      id: 'sanad-lab',
      name: 'SANAD Lab',
      type: 'item',
      color: colors.experience,
      size: 14,
      parentId: 'experience',
      image: '/sanad_logo.png',
      details: {
        title: 'Software Analysis & Developer Support Lab',
        subtitle: 'Software Engineering Research Intern',
        period: 'Apr 2025 – Aug 2025',
        location: 'NYU Abu Dhabi',
        image: '/sanad_logo.png',
        bullets: [
          'Built automated pipeline using GPT-4 to systematically inject 6 types of semantic errors into code, generating novel dataset of 1,217 labeled samples for ML model evaluation',
          'Developed UniXcoder-based classifier achieving F1-score of 0.64, outperforming linear baselines by 11.7% and establishing new benchmark for logic-aware code analysis',
          'Optimized distributed processing across HPC cluster infrastructure, reducing pipeline execution time by 40% through parallelization and memory-efficient batch processing',
        ],
        technologies: ['GPT-4', 'UniXcoder', 'Python', 'HPC', 'ML'],
        links: [{ label: 'Lab', url: 'https://sanadlab.org/' }],
      },
    },
    {
      id: 'camel-lab',
      name: 'CAMeL Lab',
      type: 'item',
      color: colors.experience,
      size: 14,
      parentId: 'experience',
      image: '/camel_logo.png',
      details: {
        title: 'CAMeL Lab – NYU',
        subtitle: 'Software Developer & NLP Research Assistant',
        period: 'Mar 2024 – May 2025',
        location: 'NYU Abu Dhabi',
        image: '/camel_logo.png',
        bullets: [
          'Achieved 95% synchronization accuracy across 77,429 tokens by engineering systematic mapping pipeline to align four disparate legacy datasets into unified, machine-readable corpus',
          'Architected 68-function Python preprocessing library handling specialized character sets, contributed to open-source CAMeL Tools library (500+ global users)',
          'Designed automated test suites and conducted code reviews, maintaining high code quality standards across the development lifecycle',
        ],
        technologies: ['Python', 'NLP', 'Arabic Processing', 'Open Source'],
        links: [
          { label: 'CAMeL Lab', url: 'https://nyuad.nyu.edu/en/research/faculty-labs-and-projects/computational-approaches-to-modeling-language-lab.html' },
          { label: 'CAMeL Tools', url: 'https://github.com/CAMeL-Lab/camel_tools' },
        ],
      },
    },
    {
      id: 'tutor',
      name: 'CS Tutor',
      type: 'item',
      color: colors.experience,
      size: 14,
      parentId: 'experience',
      icon: 'BookOpen',
      details: {
        title: 'Unix Lab – NYU',
        subtitle: 'Computer Science Peer Tutor',
        period: 'Sep 2023 – Present',
        location: 'NYU Abu Dhabi',
        bullets: [
          'Mentored 50+ students over 300+ hours in data structures, algorithms, and OOP using Java, Python, and C++',
          'Provided technical guidance on debugging methodologies, complexity analysis, and software engineering best practices',
        ],
        technologies: ['Java', 'Python', 'C++', 'Data Structures', 'Algorithms'],
      },
    },

    // ═══════════════════════════════════════
    // PROJECT ITEMS
    // ═══════════════════════════════════════
    {
      id: 'notsosimpledb',
      name: 'notSoSimpleDB',
      type: 'item',
      color: colors.projects,
      size: 14,
      parentId: 'projects',
      icon: 'Database',
      details: {
        title: 'notSoSimpleDB',
        subtitle: 'Custom Database System',
        bullets: [
          'Implemented core database internals from scratch: storage management, B-tree indexing, query optimization, transaction handling (ACID), and concurrency control with lock management',
          'Applied advanced data structures for efficient query processing, achieving sub-linear lookup times through carefully designed index structures',
        ],
        technologies: ['Java', 'B-Trees', 'ACID', 'Query Optimization'],
        links: [{ label: 'GitHub', url: 'https://github.com/mehermdsaad/notSoSimpleDB' }],
      },
    },
    {
      id: 'navi',
      name: 'Navi',
      type: 'item',
      color: colors.projects,
      size: 14,
      parentId: 'projects',
      image: '/hackharvard_logo.png',
      details: {
        title: 'Navi',
        subtitle: 'AI-Powered Computer Navigation Assistant',
        image: '/hackharvard_logo.png',
        bullets: [
          'Built multimodal AI tool at HackHarvard 2025 integrating Gemini Vision for real-time screenshot analysis, ElevenLabs TTS, and Porcupine wake-word detection for hands-free operation',
          'Engineered multi-turn conversational system providing step-by-step voice guidance, designed for elderly users navigating computer interfaces',
        ],
        technologies: ['Python', 'Gemini AI', 'ElevenLabs', 'Computer Vision'],
        links: [{ label: 'GitHub', url: 'https://github.com/Mahmoud-K-Ismail/Navi' }],
      },
    },
    {
      id: 'voucherfinder',
      name: 'VoucherFinder',
      type: 'item',
      color: colors.projects,
      size: 14,
      parentId: 'projects',
      icon: 'Search',
      details: {
        title: 'VoucherFinder',
        subtitle: 'AI-Powered Discount Aggregator',
        bullets: [
          'Led team of 3 through complete SDLC, delivering 2K+ LOC production application with JWT authentication, rate limiting, and comprehensive error handling',
          'Designed normalized database schema with optimized queries and indexing strategies, reducing average query latency by 60%',
        ],
        technologies: ['Python', 'Flask', 'React', 'TypeScript', 'SQLite'],
        links: [{ label: 'GitHub', url: 'https://github.com/Mahmoud-K-Ismail/VoucherFinder' }],
      },
    },
    {
      id: 'rentit',
      name: 'RentIt',
      type: 'item',
      color: colors.projects,
      size: 14,
      parentId: 'projects',
      icon: 'Home',
      details: {
        title: 'RentIt',
        subtitle: 'Community Rental Platform',
        bullets: [
          'Architected full-stack application as Product Owner, implementing secure authentication, transaction handling, and real-time WebSocket features with 90%+ test coverage',
          'Designed NoSQL schema with complex aggregation pipelines, implementing proper indexing for high-performance data retrieval at scale',
          'Integrated external APIs with retry mechanisms, circuit breakers, and graceful degradation to ensure fault tolerance',
        ],
        technologies: ['JavaScript', 'MongoDB', 'Node.js', 'Express', 'React'],
        links: [{ label: 'GitHub', url: 'https://github.com/RentIt-A-Community-Rental-Platform/The-Website' }],
      },
    },
    {
      id: 'budgetly',
      name: 'Budgetly',
      type: 'item',
      color: colors.projects,
      size: 14,
      parentId: 'projects',
      icon: 'Wallet',
      details: {
        title: 'Budgetly',
        subtitle: 'Financial Management Platform',
        bullets: [
          'Built RESTful backend with relational database management, input validation, and automated testing demonstrating SOLID principles',
          'Implemented structured logging and health checks for production monitoring and troubleshooting',
        ],
        technologies: ['Python', 'FastAPI', 'SQLAlchemy', 'SQLite'],
        links: [{ label: 'GitHub', url: 'https://github.com/Mahmoud-K-Ismail/Budgetly' }],
      },
    },

    // ═══════════════════════════════════════
    // RESEARCH ITEMS
    // ═══════════════════════════════════════
    {
      id: 'icse-paper',
      name: 'ICSE 2026',
      type: 'item',
      color: colors.research,
      size: 14,
      parentId: 'research',
      icon: 'FileText',
      details: {
        title: 'ICSE 2026 Publication',
        subtitle: 'LLM4Code Workshop – Accepted',
        bullets: [
          '"An Automated Methodology for Generating Labeled Datasets of Semantic Errors in Code"',
          'Authors: Kassem, M., Ribeiro, F., & Nadi, S.',
          'Presented at the International Conference on Software Engineering (ICSE), Workshop on Large Language Models for Code',
          'Received $1,500 Conference Grant to present',
        ],
        technologies: ['Research', 'LLMs', 'Code Analysis', 'ML'],
      },
    },
    {
      id: 'qamar',
      name: 'Qamar',
      type: 'item',
      color: colors.research,
      size: 14,
      parentId: 'research',
      icon: 'Book',
      details: {
        title: 'Qamar',
        subtitle: 'Quranic Morpho-syntactic Annotation Resource',
        bullets: [
          'Co-authoring paper on comprehensive Quranic text annotation system (In Preparation)',
          'Authors: Saeed, M., Kassem, M., Amjed, M., Habash, N., & Bondok, R.',
          'Building morphological and syntactic analysis tools for Arabic NLP',
        ],
        technologies: ['NLP', 'Arabic', 'Annotation', 'Linguistics'],
      },
    },

    // ═══════════════════════════════════════
    // EDUCATION ITEMS
    // ═══════════════════════════════════════
    {
      id: 'nyu',
      name: 'NYU Abu Dhabi',
      type: 'item',
      color: colors.education,
      size: 14,
      parentId: 'education',
      image: '/NYU-Logo.png',
      details: {
        title: 'New York University Abu Dhabi',
        subtitle: 'Bachelor of Science in Computer Science & Applied Mathematics',
        period: '2022 – 2026',
        location: 'Abu Dhabi, UAE',
        image: '/NYU-Logo.png',
        bullets: [
          'GPA: 3.89/4.0 | Major GPA: 3.93/4.0',
          'Relevant Coursework: Data Structures & Algorithms, Database Systems, Distributed Systems, Machine Learning, Software Engineering, Operating Systems',
          'Dean\'s List: Fall 2022, Spring 2023, Fall 2023, Spring 2024, Fall 2024',
          'Active in research labs: CAMeL Lab (NLP), SANAD Lab (Software Engineering)',
        ],
        technologies: ['Computer Science', 'Applied Mathematics', 'Research'],
        links: [
          { label: 'NYU Abu Dhabi', url: 'https://nyuad.nyu.edu/' },
        ],
      },
    },

    // ═══════════════════════════════════════
    // SKILL ITEMS
    // ═══════════════════════════════════════
    {
      id: 'languages',
      name: 'Languages',
      type: 'item',
      color: colors.skills,
      size: 14,
      parentId: 'skills',
      icon: 'Code',
      details: {
        title: 'Programming Languages',
        bullets: [
          'Java – Primary language for systems programming',
          'Python – ML, scripting, backend development',
          'C/C++ – Systems and performance-critical code',
          'JavaScript/TypeScript – Full-stack web development',
          'SQL – Database queries and optimization',
          'Bash/Shell – Scripting and automation',
        ],
        technologies: ['Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'SQL'],
      },
    },
    {
      id: 'backend',
      name: 'Backend & Cloud',
      type: 'item',
      color: colors.skills,
      size: 14,
      parentId: 'skills',
      icon: 'Server',
      details: {
        title: 'Backend & Cloud',
        bullets: [
          'FastAPI, Node.js/Express for REST API development',
          'Microservices architecture and distributed systems',
          'Docker containerization and orchestration',
          'Azure cloud services and deployment',
          'CI/CD pipelines and automation',
        ],
        technologies: ['FastAPI', 'Node.js', 'Docker', 'Azure', 'CI/CD'],
      },
    },
    {
      id: 'databases',
      name: 'Databases',
      type: 'item',
      color: colors.skills,
      size: 14,
      parentId: 'skills',
      icon: 'Database',
      details: {
        title: 'Database Technologies',
        bullets: [
          'Relational: MySQL, PostgreSQL, SQLite',
          'NoSQL: MongoDB',
          'ORM: SQLAlchemy',
          'Query optimization and indexing strategies',
          'Database design and normalization',
        ],
        technologies: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLAlchemy'],
      },
    },
    {
      id: 'systems',
      name: 'Systems & Tools',
      type: 'item',
      color: colors.skills,
      size: 14,
      parentId: 'skills',
      icon: 'Terminal',
      details: {
        title: 'Systems & Tools',
        bullets: [
          'Linux/Unix system administration',
          'Git/GitHub version control',
          'Distributed systems design',
          'HPC cluster computing',
          'Performance profiling and optimization',
        ],
        technologies: ['Linux', 'Git', 'HPC', 'Distributed Systems'],
      },
    },
  ],

  links: [
    // Root to Categories
    { source: 'root', target: 'experience' },
    { source: 'root', target: 'projects' },
    { source: 'root', target: 'research' },
    { source: 'root', target: 'education' },
    { source: 'root', target: 'skills' },
    { source: 'root', target: 'resume' },

    // Experience connections
    { source: 'experience', target: 'monta-ai' },
    { source: 'experience', target: 'sanad-lab' },
    { source: 'experience', target: 'camel-lab' },
    { source: 'experience', target: 'tutor' },

    // Projects connections
    { source: 'projects', target: 'notsosimpledb' },
    { source: 'projects', target: 'navi' },
    { source: 'projects', target: 'voucherfinder' },
    { source: 'projects', target: 'rentit' },
    { source: 'projects', target: 'budgetly' },

    // Research connections
    { source: 'research', target: 'icse-paper' },
    { source: 'research', target: 'qamar' },

    // Education connections
    { source: 'education', target: 'nyu' },

    // Skills connections
    { source: 'skills', target: 'languages' },
    { source: 'skills', target: 'backend' },
    { source: 'skills', target: 'databases' },
    { source: 'skills', target: 'systems' },
  ],
};

// Get child nodes of a category
export function getChildNodes(categoryId: string): GraphNode[] {
  return graphData.nodes.filter(node => node.parentId === categoryId);
}

// Get category nodes only
export function getCategoryNodes(): GraphNode[] {
  return graphData.nodes.filter(node => node.type === 'category');
}

// Filter nodes by search term
export function filterNodesBySearch(searchTerm: string): Set<string> {
  const matchingNodes = new Set<string>();
  const term = searchTerm.toLowerCase();
  
  graphData.nodes.forEach(node => {
    const nameMatch = node.name.toLowerCase().includes(term);
    const techMatch = node.details?.technologies?.some(t => 
      t.toLowerCase().includes(term)
    );
    
    if (nameMatch || techMatch) {
      matchingNodes.add(node.id);
      // Add parent
      if (node.parentId) matchingNodes.add(node.parentId);
      // Add root
      matchingNodes.add('root');
    }
  });
  
  return matchingNodes;
}
