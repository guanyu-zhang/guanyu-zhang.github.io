import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About - Guanyu Zhang',
  description: 'About Guanyu Zhang, a software engineer specializing in distributed systems and AI.',
};

const skills = ['Java', 'Python', 'Go', 'JavaScript', 'SQL', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'PyTorch', 'MongoDB', 'Redis'];

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 md:pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">About Me</h1>
          
          <div className="prose prose-invert prose-lg mx-auto text-neutral-300">
            <p>
              I am a software engineer with a Master's in Computer Science from Columbia University, specializing in Machine Learning. My professional experience at companies like Ant Group and Alipay has given me a strong background in designing and implementing large-scale distributed systems and backend services. 
            </p>
            <p>
              I am particularly passionate about the intersection of distributed systems and artificial intelligence, with experience developing AI-powered tools for automated testing and building cloud-native applications. I thrive on solving complex problems and enhancing system reliability and performance.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-4 text-white">Technical Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-neutral-800 text-neutral-200 text-sm font-medium rounded-md">
                  {skill}
                </span>
              ))}
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-4 text-white">Contact</h2>
            <p>
              You can reach me via email at <a href="mailto:evanz1627@gmail.com" className="text-cyan-400 hover:underline">evanz1627@gmail.com</a> or connect with me on social media.
            </p>
            <div className="flex items-center gap-4 mt-4">
                <a href="https://github.com/guanyu-zhang" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">GitHub</a>
                <a href="https://www.linkedin.com/in/guanyuzhang/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
