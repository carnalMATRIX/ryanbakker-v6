import { getCachedPayload } from '@/lib/payload'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getCachedPayload()
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ryanbakker.vercel.app'

  // Fetch all projects to generate dynamic paths
  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 0,
    limit: 1000,
  })

  const projectUrls = projects.map((project) => ({
    url: `${siteUrl}/projects/${(project as any).projectBehaviour?.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const staticUrls = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  return [...staticUrls, ...projectUrls]
}
