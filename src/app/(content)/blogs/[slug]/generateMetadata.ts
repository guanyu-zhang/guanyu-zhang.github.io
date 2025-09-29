import { getPostData } from '@/lib/content';
import type { Metadata, ResolvingMetadata } from 'next';
 
type Props = {
  params: { slug: string };
};
 
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostData('blogs', params.slug);
 
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
 
  return {
    title: post.title,
    description: post.content.substring(0, 150), // Use first 150 chars as description
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 150),
      url: `/blogs/${post.slug}`,
      siteName: 'Guanyu Zhang\'s Website',
      images: [
        {
          url: '/images/og-default.png', // Must be an absolute URL
          width: 1200,
          height: 630,
        },
        ...previousImages,
      ],
      locale: 'en_US',
      type: 'article',
      authors: [post.author],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.substring(0, 150),
      images: ['/images/og-default.png'], // Must be an absolute URL
    },
  };
}
