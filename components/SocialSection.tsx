import ContactSection from "./ContactSection";
import SocialGallery, { SocialCard } from "./SocialGallery";
import { DotPattern } from "./DotPattern";

interface SocialSectionProps {
  socialCards?: SocialCard[] | null;
  contactDescription?: string | null;
  location?: string | null;
  email?: string | null;
}

function SocialSection({
  socialCards,
  contactDescription,
  location,
  email,
}: SocialSectionProps) {
  return (
    <DotPattern
      className="py-16 md:py-24 border-t border-white/5"
      baseColor="#322254"
      glowColor="#b492f4"
      glowIntensity={1.4}
    >
      <SocialGallery socialCards={socialCards} />
      <ContactSection
        contactDescription={contactDescription}
        location={location}
        email={email}
      />
      <div className="h-10" />
    </DotPattern>
  );
}

export default SocialSection;
