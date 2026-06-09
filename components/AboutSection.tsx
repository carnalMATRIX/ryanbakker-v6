"use client";

import AboutBento from "./AboutBento";

function AboutSection({
  data,
}: {
  data?: any;
}) {
  return (
    <section
      id="continue"
      className="section-parent z-0 bg-neutral-950 relative py-24 md:py-32 overflow-visible border-t border-white/5"
    >
      <AboutBento data={data} />
    </section>
  );
}

export default AboutSection;
