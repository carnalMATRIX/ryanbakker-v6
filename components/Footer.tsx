function Footer() {
  return (
    <footer className="bg-neutral-950 pb-8 section-parent text-white overflow-hidden">
      <div className="section-child py-0! w-full">
        <svg
          viewBox="0 0 1004 200"
          className="w-[101%] h-[40vh] min-h-50 -ml-1 md:-ml-3"
          preserveAspectRatio="none"
          aria-label="Ryan Beckett"
        >
          <text
            x="0"
            y="180" // Adjusted for the new font size baseline
            fontSize="250" // <-- THIS CONTROLS THE TEXT HEIGHT
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="#FFC58E"
            className="font-medium uppercase tracking-tighter"
          >
            Ryan Beckett
          </text>
        </svg>

        <div className="flex flex-col md:flex-row items-center gap-2 justify-between w-full -mt-2 md:-mt-6">
          <span>In case you forgot ;)</span>
          <span>All Rights Reserved. 2026.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
