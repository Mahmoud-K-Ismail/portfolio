import { NextRequest, NextResponse } from 'next/server';
import { graphData } from '@/lib/graphData';

// Build comprehensive context from graph data
function buildContext(): string {
  let context = `Mahmoud Kassem - Computer Science & Applied Mathematics student at NYU Abu Dhabi, graduating May 2026.
GPA: 3.89/4.0, Major GPA: 3.93/4.0.

EDUCATION:
- New York University (NYU) Abu Dhabi, Sep 2022 - May 2026
- B.S. in Computer Science & Applied Mathematics
- Related Coursework: Data Structures, Algorithms, Software Engineering, Database Systems, Computer Networks, Operating Systems, Object-Oriented Design, Machine Learning

`;

  // Add experience
  const experienceNodes = graphData.nodes.filter(n => n.parentId === 'experience');
  context += 'EXPERIENCE:\n';
  experienceNodes.forEach(node => {
    if (node.details) {
      context += `- ${node.details.title}${node.details.subtitle ? ` (${node.details.subtitle})` : ''}\n`;
      if (node.details.period) context += `  Period: ${node.details.period}\n`;
      if (node.details.location) context += `  Location: ${node.details.location}\n`;
      if (node.details.bullets) {
        node.details.bullets.forEach(bullet => {
          context += `  • ${bullet}\n`;
        });
      }
      if (node.details.technologies) {
        context += `  Technologies: ${node.details.technologies.join(', ')}\n`;
      }
      context += '\n';
    }
  });

  // Add projects
  const projectNodes = graphData.nodes.filter(n => n.parentId === 'projects');
  context += 'PROJECTS:\n';
  projectNodes.forEach(node => {
    if (node.details) {
      context += `- ${node.details.title}${node.details.subtitle ? ` (${node.details.subtitle})` : ''}\n`;
      if (node.details.bullets) {
        node.details.bullets.forEach(bullet => {
          context += `  • ${bullet}\n`;
        });
      }
      if (node.details.technologies) {
        context += `  Technologies: ${node.details.technologies.join(', ')}\n`;
      }
      context += '\n';
    }
  });

  // Add research
  const researchNodes = graphData.nodes.filter(n => n.parentId === 'research');
  context += 'RESEARCH:\n';
  researchNodes.forEach(node => {
    if (node.details) {
      context += `- ${node.details.title}${node.details.subtitle ? ` (${node.details.subtitle})` : ''}\n`;
      if (node.details.bullets) {
        node.details.bullets.forEach(bullet => {
          context += `  • ${bullet}\n`;
        });
      }
      context += '\n';
    }
  });

  // Add skills
  const skillNodes = graphData.nodes.filter(n => n.parentId === 'skills');
  context += 'TECHNICAL SKILLS:\n';
  skillNodes.forEach(node => {
    if (node.details) {
      context += `- ${node.details.title}:\n`;
      if (node.details.bullets) {
        node.details.bullets.forEach(bullet => {
          context += `  • ${bullet}\n`;
        });
      }
      if (node.details.technologies) {
        context += `  ${node.details.technologies.join(', ')}\n`;
      }
      context += '\n';
    }
  });

  return context;
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Check for personal questions (more precise matching)
    const lowerQuestion = question.toLowerCase();
    const personalPatterns = [
      /\bpersonal\b/,
      /\bprivate\b/,
      /\bfamily\b/,
      /\bage\b(?!\s*(?:manager|management|of))/,
      /\bbirthday\b/,
      /\baddress\b/,
      /\bphone\b/,
      /\bsalary\b/,
      /\bincome\b/,
    ];
    
    // Allow role-related questions even if they contain words like "manager"
    const isRoleQuestion = /\b(product|project|engineering|software|ai|ml|engineer|developer|manager|pm|swe)\b/i.test(question);
    const isPersonal = !isRoleQuestion && personalPatterns.some(pattern => pattern.test(lowerQuestion));

    if (isPersonal) {
      return NextResponse.json({
        answer: "I can only answer questions about Mahmoud's professional career, experience, projects, research, and technical skills. I cannot provide personal information.",
      });
    }

    const context = buildContext();

    // Use Mistral AI API
    const mistralApiKey = process.env.MISTRAL_API_KEY;

    if (mistralApiKey) {
      // Use Mistral AI for responses
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mistralApiKey}`,
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that answers questions about Mahmoud Kassem's professional career. 
              
              IMPORTANT INSTRUCTIONS:
              - Use ONLY the provided context. Do not make up information.
              - Be CONCISE but SPECIFIC: 2-4 paragraphs maximum. Include key metrics, technologies, and achievements.
              - For role-fit questions: Focus on 3-5 most relevant points with specific examples and metrics.
              - Format responses using markdown: Use **bold** for section headers, bullet points with - or *, and proper line breaks.
              - Structure: Brief intro, then sections with **bold headers**, then bullet points with specific examples.
              - Include concrete numbers (GPA, percentages, project sizes) when relevant.
              - For roles he hasn't held: Explain transferable skills from his technical background.
              - Keep answers professional and focused on career topics only.
              - Do NOT use asterisks for emphasis in the middle of sentences - only use **bold** for section headers.
              
              Context:
              ${context}`,
            },
            {
              role: 'user',
              content: question,
            },
          ],
          temperature: 0.6,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Mistral API error:', errorText);
        throw new Error('Mistral API error');
      }

      const data = await response.json();
      return NextResponse.json({
        answer: data.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
      });
    } else {
      // Fallback: Simple keyword-based response
      const lowerQuestion = question.toLowerCase();
      let answer = '';

      // Product/Project Manager questions
      if (lowerQuestion.includes('product manager') || lowerQuestion.includes('project manager') || (lowerQuestion.includes('pm') && !lowerQuestion.includes('program'))) {
        answer = `While Mahmoud hasn't held a Product Manager role, he has strong transferable skills:\n\n`;
        answer += `**Technical Product Understanding**\n`;
        answer += `- Led team of 3 through complete SDLC for VoucherFinder (2K+ LOC production app)\n`;
        answer += `- Architected full-stack applications as Product Owner for RentIt with 90%+ test coverage\n`;
        answer += `- Built production RAG system at Monta AI, reducing document lookup time by 70%\n\n`;
        answer += `**User-Centric Development**\n`;
        answer += `- Built Navi - AI navigation assistant specifically designed for elderly users\n`;
        answer += `- Mentored 50+ students, demonstrating ability to understand user needs and provide solutions\n\n`;
        answer += `**Technical Leadership**\n`;
        answer += `- Optimized distributed processing, reducing pipeline execution time by 40%\n`;
        answer += `- Designed database schemas with optimized queries, reducing latency by 60%\n`;
        answer += `- Strong foundation in system design, algorithms, and software engineering principles\n\n`;
        answer += `His technical depth combined with project leadership experience makes him a strong candidate for technical PM roles.`;
      }
      // Role fit questions
      else if (lowerQuestion.includes('fit') || lowerQuestion.includes('suitable') || lowerQuestion.includes('match')) {
        if (lowerQuestion.includes('software engineer') || lowerQuestion.includes('swe') || lowerQuestion.includes('developer')) {
          answer = `Mahmoud is an excellent fit for Software Engineer roles:\n\n`;
          answer += `**Production Experience**\n`;
          answer += `- AI Engineer Intern at Monta AI (Sep 2025 - Present): Built production RAG systems using FastAPI on Azure, reducing document lookup time by 70%\n`;
          answer += `- Implemented comprehensive error handling and monitoring for distributed API endpoints\n\n`;
          answer += `**Full-Stack Development**\n`;
          answer += `- Led VoucherFinder team (2K+ LOC) with JWT auth, rate limiting, optimized queries (60% latency reduction)\n`;
          answer += `- Built RentIt platform with WebSocket features, NoSQL aggregation pipelines, 90%+ test coverage\n`;
          answer += `- Technologies: Java, Python, JavaScript/TypeScript, React, Node.js, FastAPI, PostgreSQL, MongoDB\n\n`;
          answer += `**System Design**\n`;
          answer += `- Built notSoSimpleDB from scratch: B-tree indexing, ACID transactions, query optimization\n`;
          answer += `- Experience with microservices, distributed systems, HPC clusters\n\n`;
          answer += `**Research & Problem-Solving**\n`;
          answer += `- Published research at ICSE 2026 on semantic errors in code\n`;
          answer += `- Developed UniXcoder classifier (F1-score 0.64) for code analysis\n`;
          answer += `- Strong CS foundation: GPA 3.89/4.0, Major GPA 3.93/4.0\n\n`;
          answer += `His combination of production experience, full-stack skills, and research background makes him ideal for software engineering roles.`;
        } else {
          answer = `Based on Mahmoud's background:\n\n`;
          answer += `• Strong foundation in Computer Science & Applied Mathematics (GPA 3.89/4.0, Major GPA 3.93/4.0)\n`;
          answer += `• Production experience at Monta AI building RAG systems, reducing document lookup by 70%\n`;
          answer += `• Research experience: Published at ICSE 2026, developed ML models (F1-score 0.64)\n`;
          answer += `• Full-stack development: Led teams, built 2K+ LOC apps, optimized databases (60% latency reduction)\n`;
          answer += `• Technologies: Java, Python, JavaScript/TypeScript, React, Node.js, FastAPI, Azure, PostgreSQL, MongoDB\n`;
          answer += `• System design: Built database engine from scratch, microservices, distributed systems\n\n`;
          answer += `Mahmoud is well-suited for software engineering, AI/ML engineering, and research roles.`;
        }
      }
      // AI Engineer role questions
      else if ((lowerQuestion.includes('ai engineer') || lowerQuestion.includes('ai/ml engineer')) && (lowerQuestion.includes('fit') || lowerQuestion.includes('suitable') || lowerQuestion.includes('role'))) {
        answer = `Mahmoud is an excellent fit for AI Engineer roles:\n\n`;
        answer += `**Current AI Engineering Experience**\n`;
        answer += `- AI Engineer Intern at Monta AI: Built production RAG systems (FastAPI, Azure), reduced document lookup by 70%\n`;
        answer += `- Developed parsing pipelines with LlamaIndex/Ollama, mitigating hallucination risks\n`;
        answer += `- Implemented error handling and monitoring for distributed APIs\n\n`;
        answer += `**LLM & ML Research**\n`;
        answer += `- NYU Software Lab: Built GPT-4 pipeline generating 1,217 labeled samples, developed UniXcoder classifier (F1-score 0.64)\n`;
        answer += `- Published at ICSE 2026 on semantic errors in code using LLMs\n`;
        answer += `- Optimized HPC processing, reducing execution time by 40%\n\n`;
        answer += `**AI Projects**\n`;
        answer += `- Navi: Multimodal AI assistant (Gemini Vision, ElevenLabs TTS) at HackHarvard 2025\n`;
        answer += `- NLP research at CAMeL Lab: 95% accuracy across 77,429 tokens, contributed to open-source CAMeL Tools (500+ users)\n\n`;
        answer += `**Technical Stack:** Python, FastAPI, Azure, GPT-4, LlamaIndex, Ollama, UniXcoder, Gemini AI, NLP frameworks`;
      }
      // AI/ML questions
      else if (lowerQuestion.includes('ai') || lowerQuestion.includes('machine learning') || lowerQuestion.includes('ml') || lowerQuestion.includes('llm')) {
        answer = `Mahmoud has extensive AI/ML experience:\n\n`;
        answer += `• AI Engineer Intern at Monta AI: Production RAG systems (FastAPI, Azure), 70% reduction in document lookup time\n`;
        answer += `• Research at NYU Software Lab: GPT-4 pipelines, UniXcoder classifier (F1-score 0.64)\n`;
        answer += `• Built Navi: AI navigation assistant (Gemini Vision, ElevenLabs TTS) at HackHarvard 2025\n`;
        answer += `• NLP research at CAMeL Lab: Arabic processing, 95% accuracy, open-source contributions\n`;
        answer += `• Published research at ICSE 2026 on semantic errors using LLMs`;
      }
      // Experience questions
      else if (lowerQuestion.includes('experience') || lowerQuestion.includes('work')) {
        answer = `Mahmoud's professional experience:\n\n`;
        answer += `1. Monta AI (Sep 2025 - Present): AI Engineer Intern - Building RAG systems, reducing document lookup time by 70%\n`;
        answer += `2. NYU Software Lab (Apr 2025 - Aug 2025): Research Intern - Generated 1,217 labeled samples for ML evaluation\n`;
        answer += `3. CAMeL Lab (Mar 2024 - May 2025): Software Developer & NLP Research - Achieved 95% synchronization accuracy across 77,429 tokens\n`;
        answer += `4. Unix Lab (Sep 2023 - Present): CS Peer Tutor - Mentored 50+ students over 300+ hours`;
      }
      // Projects questions
      else if (lowerQuestion.includes('project')) {
        answer = `Key projects:\n\n`;
        answer += `• notSoSimpleDB: Custom database engine from scratch with B-tree indexing and ACID transactions\n`;
        answer += `• Navi: AI-powered navigation assistant with Gemini Vision and voice guidance\n`;
        answer += `• VoucherFinder: Full-stack discount aggregator with 2K+ LOC\n`;
        answer += `• RentIt: Community rental platform with WebSocket features and 90%+ test coverage\n`;
        answer += `• Budgetly: Financial management platform with FastAPI backend`;
      }
      // Skills questions
      else if (lowerQuestion.includes('skill') || lowerQuestion.includes('technology') || lowerQuestion.includes('tech stack')) {
        answer = `Technical skills:\n\n`;
        answer += `Languages: Java, Python, C++/C, JavaScript, TypeScript, SQL, Bash\n`;
        answer += `Backend & Cloud: FastAPI, Node.js/Express, REST APIs, Microservices, Docker, Azure, CI/CD\n`;
        answer += `Databases: MySQL, PostgreSQL, MongoDB, SQLite, NoSQL, SQLAlchemy\n`;
        answer += `Systems: Linux/Unix, Git/GitHub, Distributed Systems, HPC Clusters\n`;
        answer += `Engineering: Data Structures & Algorithms, System Design, Automated Testing`;
      }
      // Research questions
      else if (lowerQuestion.includes('research') || lowerQuestion.includes('publication')) {
        answer = `Research experience:\n\n`;
        answer += `• ICSE 2026 (Accepted): "An Automated Methodology for Generating Labeled Datasets of Semantic Errors in Code" - LLM4Code Workshop\n`;
        answer += `• Qamar (In Preparation): Quranic Morpho-syntactic Annotation Resource\n`;
        answer += `• NYU Software Lab: Semantic error injection using GPT-4, UniXcoder classifier with F1-score 0.64\n`;
        answer += `• CAMeL Lab: Arabic NLP and morphological analysis, contributed to open-source CAMeL Tools library`;
      }
      // Default response
      else {
        answer = `I can help you learn about Mahmoud's:\n\n`;
        answer += `• Professional experience (Monta AI, NYU Software Lab, CAMeL Lab)\n`;
        answer += `• Projects (notSoSimpleDB, Navi, VoucherFinder, RentIt, Budgetly)\n`;
        answer += `• Research (ICSE 2026 publication, Qamar project)\n`;
        answer += `• Technical skills (Languages, Backend, Databases, Systems)\n\n`;
        answer += `Try asking: "How is Mahmoud a fit for a Software Engineer role?" or "Tell me about his AI experience."`;
      }

      return NextResponse.json({ answer });
    }
  } catch (error) {
    console.error('RAG API error:', error);
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    );
  }
}

