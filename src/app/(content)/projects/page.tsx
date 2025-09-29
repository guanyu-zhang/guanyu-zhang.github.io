import Link from 'next/link';
import { getSortedPostsData } from '@/lib/content';
import type { Post } from '@/lib/types';

const POSTS_PER_PAGE = 6;

function ProjectCard({ project }: { project: Post }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="block p-6 bg-neutral-800 rounded-lg shadow-lg hover:bg-neutral-700 transition-colors duration-300 h-full">
        <h2 className="text-2xl font-bold mb-2 text-white">{project.title}</h2>
        <div className="text-neutral-400 mb-2 flex items-center">
          <span>{project.author}</span>
          {project.location && (
            <>
              <span className="mx-2">|</span>
              <span>{project.location}</span>
            </>
          )}
        </div>
        <p className="text-neutral-400">{new Date(project.date).toLocaleDateString()}</p>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const allProjects = getSortedPostsData('projects');
  const currentPage = 1;
  const totalPages = Math.ceil(allProjects.length / POSTS_PER_PAGE);

  const projects = allProjects.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Projects</h1>
        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-8 mt-12">
          {/* No Previous button on page 1 */}
          <span className='text-lg font-medium text-white'>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={`/projects/page/${currentPage + 1}`}>
              <span className="text-lg font-medium text-neutral-400 hover:text-white transition-colors">Next</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
