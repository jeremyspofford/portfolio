'use client';

import { Brain, Sparkles, Rocket, ExternalLink, Github } from 'lucide-react';
import { useFeatureFlag } from '@/lib/featureFlags';

interface AIProject {
  title: string;
  description: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
  link?: string;
  github?: string;
}

interface AIShowcaseProps {
  projects?: AIProject[];
}

// Default projects if none provided from database
const defaultProjects: AIProject[] = [
  {
    title: "Portfolio Job Fit Analyzer",
    description: "AI-powered tool that analyzes job postings and compares them against candidate skills using Claude on AWS Bedrock. Provides star ratings and fit summaries for recruiters.",
    technologies: ["AWS Bedrock", "Claude AI", "Next.js", "TypeScript"],
    status: "completed",
  },
  {
    title: "AI Infrastructure Platform",
    description: "Building scalable infrastructure for ML model deployment using Kubernetes, MLflow, and cloud-native tools.",
    technologies: ["Kubernetes", "MLflow", "Terraform", "Python"],
    status: "in-progress",
  },
  {
    title: "LLM-Powered DevOps Assistant",
    description: "Developing an AI assistant for infrastructure management and incident response using RAG and custom fine-tuning.",
    technologies: ["LangChain", "Vector DB", "Claude API", "Python"],
    status: "planned",
  },
];

const statusConfig = {
  'completed': { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' },
  'in-progress': { label: 'In Progress', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800' },
  'planned': { label: 'Planned', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700' },
};

export function AIShowcase({ projects = defaultProjects }: AIShowcaseProps) {
  const showAIShowcase = useFeatureFlag('showAIShowcase');

  // Feature flag controls visibility
  if (!showAIShowcase) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-20 px-4 bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20 dark:to-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            AI Engineering Journey
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Building the Future with AI
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leveraging my DevOps and cloud infrastructure expertise to build scalable AI/ML platforms and intelligent automation tools.
          </p>
        </div>

        {/* Skills Bridge */}
        <div className="grid md:grid-cols-3 gap-4 mb-10 md:mb-14">
          <div className="p-4 bg-card border rounded-lg text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold mb-1">DevOps Foundation</h3>
            <p className="text-xs text-muted-foreground">CI/CD, Kubernetes, Terraform, AWS</p>
          </div>
          <div className="p-4 bg-card border rounded-lg text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-violet-500 text-white text-[10px] font-bold rounded-full uppercase">
              Bridging
            </div>
            <div className="w-10 h-10 mx-auto mb-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-semibold mb-1">MLOps & Platform</h3>
            <p className="text-xs text-muted-foreground">Model deployment, monitoring, scaling</p>
          </div>
          <div className="p-4 bg-card border rounded-lg text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-1">AI Engineering</h3>
            <p className="text-xs text-muted-foreground">LLMs, RAG, AI agents, fine-tuning</p>
          </div>
        </div>

        {/* AI Projects */}
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          AI Projects & Experiments
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group flex flex-col bg-card rounded-xl p-5 border border-border hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                  <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusConfig[project.status].color}`}>
                  {statusConfig[project.status].label}
                </span>
              </div>

              <h4 className="text-lg font-bold mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {project.title}
              </h4>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-full text-[10px] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 mt-auto">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-violet-600 dark:text-violet-400 hover:underline font-medium"
                  >
                    View Project <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
