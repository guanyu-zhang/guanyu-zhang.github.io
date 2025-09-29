import type { MDXComponents } from 'mdx/types';
import Pdf from '@/components/Pdf';
import CodeBlockWrapper from '@/components/CodeBlock';
 
// This file allows you to provide custom components to MDX files.
// You can import and use any React component you want.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    pre: CodeBlockWrapper,
    
    // Add custom components to be available in MDX files.
    Pdf,

    ...components,
  };
}