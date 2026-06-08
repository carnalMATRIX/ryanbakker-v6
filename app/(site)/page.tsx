import EducationSection from "@/components/EducationSection";
import Footer from "@/components/Footer";
import InspoSection from "@/components/InspoSection";
import ProjectSection, {
  type Project as ProjectSectionProject,
} from "@/components/ProjectSection";
import SocialSection from "@/components/SocialSection";
import HomeClient from "./HomeClient";
import { getCachedPayload } from "@/lib/payload";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { SocialCard } from "@/components/SocialGallery";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const revalidate = 3600; // revalidate every hour

export const metadata: Metadata = {
  title: "Home | Full Stack Developer & Digital Artist",
  description:
    "Ryan Beckett: AUT Software Development & AI student blending technical logic with visual design. Specializing in Next.js, web architecture, and human-AI interaction.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const payload = await getCachedPayload();
  const homeContent = await payload.find({
    collection: "home-content",
    limit: 1,
    depth: 5,
  });

  const projects = await payload.find({
    collection: "projects",
    limit: 3,
    sort: ["projectBehaviour.isFeatured", "-createdAt"],
    where: {
      or: [
        {
          "projectBehaviour.isHighlighted": {
            equals: true,
          },
        },
        {
          "projectBehaviour.isFeatured": {
            equals: true,
          },
        },
      ],
    },
  });

  const data = homeContent.docs[0];
  const siteUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://beckett.vercel.app";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ryan Beckett",
    url: siteUrl,
    jobTitle: "Full Stack Developer & Digital Artist",
    sameAs: [
      "https://github.com/carnalMATRIX",
      "https://linkedin.com/in/rd-beckett",
      "https://www.instagram.com/rd.beckett/",
    ],
    description:
      "Ryan Beckett is a Full Stack Developer and Digital Artist specializing in building modern web applications.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ryan Beckett Portfolio",
    url: siteUrl,
  };

  return (
    <main className="w-full">
      <JsonLd data={personSchema} />
      <JsonLd data={websiteSchema} />
      <HomeClient data={data} />
      ...
      <ProjectSection projects={projects.docs} />
      <EducationSection
        quote={data?.educationQuote}
        quoteAuthor={data?.educationQuoteAuthor}
        extracurricularActivities={data?.extracurricularActivities}
        bodyText={
          data?.educationBodyText && (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <RichText data={data.educationBodyText as any} />
          )
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items={data?.educationItems?.map((item: any) => ({
          ...item,
          mission: item.mission ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <RichText data={item.mission as any} />
          ) : null,
        }))}
      />
      <InspoSection inspirations={data.inspirations} />
      <SocialSection
        socialCards={data?.socialCards as SocialCard[]}
        contactDescription={data?.contactDescription}
        location={data?.location}
        email={data?.email}
      />
      <div className="h-20 bg-neutral-950" />
      <Footer />
    </main>
  );
}
