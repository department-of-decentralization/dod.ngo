import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import galleries from '@/data/galleries'
import siteMetadata from '@/data/siteMetadata'

// Metadata routes must be marked static to be exported (output: 'export')
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  // The gallery index and every gallery page, placeholders included (SPEC.md D30)
  const galleryRoutes = ['gallery', ...galleries.map((gallery) => `gallery/${gallery.slug}`)]

  const routes = ['', 'blog', 'projects', 'tags', ...galleryRoutes].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
