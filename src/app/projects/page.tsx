import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects - Guanyu Zhang',
  description: 'A selection of projects by Guanyu Zhang.',
};

const projects = [
  {
    title: 'AI Showcase',
    description: 'A web application to showcase various AI models and experiments. Built with Next.js and deployed on GitHub Pages.',
    href: 'https://guanyu-zhang.github.io/ai-showcase/',
    stack: ['Next.js', 'React', 'AI'],
  },
  // More projects can be added here
];

export default function ProjectsPage() {
  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">My Projects</h1>
        <div className="max-w-3xl mx-auto">
          <ul className="space-y-8">
            {projects.map((project) => (
              <li key={project.title}>
                <a href={project.href} target="_blank" rel="noopener noreferrer" className="block p-6 border border-neutral-800 rounded-lg hover:bg-neutral-900 transition-colors duration-300">
                  <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                  <p className="text-neutral-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-neutral-800 text-sm rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
