import { getCachedPayload } from '@/lib/payload'
import { MetadataRoute } from 'next'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ryanbakker.vercel.app'

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

  try {
    const payload = await getCachedPayload()

    // Fetch all projects to generate dynamic paths
    const { docs: projects } = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1000,
    })

    const projectUrls = projects
      .filter((project: any) => project.projectBehaviour?.slug)
      .map((project: any) => ({
        url: `${siteUrl}/projects/${project.projectBehaviour.slug}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))

    return [...staticUrls, ...projectUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticUrls
  }
}
