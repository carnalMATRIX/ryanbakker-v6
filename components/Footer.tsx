function Footer() {
  return (
    <footer className="bg-neutral-950 pb-8 section-parent text-white overflow-hidden border-t border-white/5">
      <div className="section-child py-0! w-full">
        <svg
          viewBox="0 0 1004 200"
          className="w-[101%] h-[40vh] min-h-50 -ml-1 md:-ml-3 select-none pointer-events-none"
          preserveAspectRatio="none"
          aria-label="Ryan Beckett"
        >
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b492f4" />
              <stop offset="100%" stopColor="#1a0f2b" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="180" // Adjusted for the new font size baseline
            fontSize="250" // <-- THIS CONTROLS THE TEXT HEIGHT
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#footerGradient)"
            className="font-black uppercase tracking-tighter"
          >
            Ryan Beckett
          </text>
        </svg>

        <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full -mt-2 md:-mt-6 text-zinc-500 font-mono text-[10px] tracking-widest uppercase pb-4">
          <span>In case you forgot ;)</span>
          <span>All Rights Reserved. 2026.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
