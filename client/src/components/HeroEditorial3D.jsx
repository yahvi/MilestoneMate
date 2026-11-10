import React from 'react';

/**
 * HeroEditorial3D
 * Custom layout requested:
 * - Line 1: BUILD TRUST. TRACK (in one line, centered, clear word spacing)
 * - Line 2: PROGRESS. (in another line, centered with Line 1)
 * - Line 3: GET PAID MILESTONE BY MILESTONE. (in one line, centered, vermillion linocut 3D)
 * - Sized appropriately to be 100% clear, legible, and comfortable on all devices
 */
export default function HeroEditorial3D() {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-8 sm:py-12 px-3 sm:px-6 select-none flex flex-col items-center justify-center">
      {/* ========================================================
          BACKGROUND LAYER: CURVED LINES PATTERN & ENGRAVED ORBS
          ======================================================== */}
      <svg
        viewBox="0 0 1000 420"
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sphere-gradient-hero" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FF6A55" />
            <stop offset="60%" stopColor="#EB442C" />
            <stop offset="92%" stopColor="#B32412" />
            <stop offset="100%" stopColor="#751307" />
          </radialGradient>
        </defs>

        {/* Curved Lines Orbital Pattern */}
        <ellipse
          cx="500"
          cy="210"
          rx="470"
          ry="160"
          fill="none"
          stroke="#EB442C"
          strokeWidth="1.2"
          opacity="0.38"
          transform="rotate(-1.5 500 210)"
        />
        <ellipse
          cx="500"
          cy="210"
          rx="430"
          ry="140"
          fill="none"
          stroke="#0D2B1D"
          strokeWidth="1"
          strokeDasharray="5,6"
          opacity="0.22"
          transform="rotate(2 500 210)"
        />
        <path
          d="M 60,200 C 120,60 320,40 500,70 C 720,100 900,60 950,200 C 970,280 850,380 630,370 C 410,360 180,400 90,290 C 60,250 65,220 60,200 Z"
          fill="none"
          stroke="#EB442C"
          strokeWidth="1.3"
          opacity="0.5"
        />
        <path
          d="M 120,120 C 290,20 760,30 910,130 C 970,190 910,330 740,350 C 490,380 220,320 110,230"
          fill="none"
          stroke="#0D2B1D"
          strokeWidth="1"
          opacity="0.18"
        />

        {/* Left Orb: Verified Deliverables */}
        <g transform="translate(35, 210)">
          <ellipse cx="3" cy="14" rx="34" ry="12" fill="#0D2B1D" opacity="0.12" />
          <circle cx="0" cy="0" r="32" fill="url(#sphere-gradient-hero)" stroke="#0D2B1D" strokeWidth="1.5" />
          <circle cx="-4" cy="-3" r="24" fill="none" stroke="#751307" strokeWidth="0.8" opacity="0.6" />
          <circle cx="-7" cy="-4" r="16" fill="none" stroke="#751307" strokeWidth="0.8" opacity="0.6" />
          <circle cx="-10" cy="-6" r="9" fill="none" stroke="#751307" strokeWidth="0.8" opacity="0.6" />
          <circle cx="-12" cy="-8" r="4" fill="none" stroke="#FAF6EC" strokeWidth="1" opacity="0.8" />
          <circle cx="4" cy="4" r="9" fill="#0D2B1D" stroke="#FAF6EC" strokeWidth="0.8" />
          <circle cx="4" cy="4" r="4" fill="#184230" />
        </g>

        {/* Right Orb: PayPal Payouts */}
        <g transform="translate(965, 210)">
          <ellipse cx="3" cy="14" rx="34" ry="12" fill="#0D2B1D" opacity="0.12" />
          <circle cx="0" cy="0" r="32" fill="url(#sphere-gradient-hero)" stroke="#0D2B1D" strokeWidth="1.5" />
          <circle cx="-4" cy="-3" r="24" fill="none" stroke="#751307" strokeWidth="0.8" opacity="0.6" />
          <circle cx="-7" cy="-4" r="16" fill="none" stroke="#751307" strokeWidth="0.8" opacity="0.6" />
          <circle cx="-10" cy="-6" r="9" fill="none" stroke="#751307" strokeWidth="0.8" opacity="0.6" />
          <circle cx="-12" cy="-8" r="4" fill="none" stroke="#FAF6EC" strokeWidth="1" opacity="0.8" />
          <circle cx="4" cy="4" r="9" fill="#0D2B1D" stroke="#FAF6EC" strokeWidth="0.8" />
          <circle cx="4" cy="4" r="4" fill="#184230" />
        </g>

        {/* Starburst Crosshairs */}
        <g stroke="#EB442C" strokeWidth="1.2" fill="#EB442C">
          <g transform="translate(850, 40)">
            <line x1="-12" y1="0" x2="12" y2="0" />
            <line x1="0" y1="-12" x2="0" y2="12" />
            <circle cx="0" cy="0" r="1.5" />
          </g>
          <g transform="translate(150, 380)">
            <line x1="-12" y1="0" x2="12" y2="0" />
            <line x1="0" y1="-12" x2="0" y2="12" />
            <circle cx="0" cy="0" r="1.5" />
          </g>
        </g>
      </svg>

      {/* ========================================================
          FOREGROUND LAYER: CLEAR, WELL-SPACED 3D TYPOGRAPHY
          ======================================================== */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
        {/* Line 1: BUILD TRUST. TRACK (All in one line) */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-5 md:gap-6 whitespace-nowrap flex-nowrap">
          <span className="linocut-3d-emerald text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider px-1">
            BUILD
          </span>
          <span className="linocut-3d-emerald text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider px-1">
            TRUST.
          </span>
          <span className="linocut-3d-emerald text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider px-1">
            TRACK
          </span>
        </div>

        {/* Line 2: PROGRESS. (Centered directly with previous line) */}
        <div className="flex items-center justify-center mt-2 sm:mt-3">
          <span className="linocut-3d-emerald text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider px-1">
            PROGRESS.
          </span>
        </div>

        {/* Line 3: GET PAID MILESTONE BY MILESTONE. (All in one line, Vermillion 3D) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 mt-3 sm:mt-5 whitespace-nowrap flex-nowrap">
          <span className="linocut-3d-vermillion text-base sm:text-2xl md:text-3xl font-black uppercase tracking-wider px-0.5">
            GET
          </span>
          <span className="linocut-3d-vermillion text-base sm:text-2xl md:text-3xl font-black uppercase tracking-wider px-0.5">
            PAID
          </span>
          <span className="linocut-3d-vermillion text-base sm:text-2xl md:text-3xl font-black uppercase tracking-wider px-0.5">
            MILESTONE
          </span>
          <span className="linocut-3d-vermillion text-xs sm:text-xl md:text-2xl font-black uppercase tracking-widest px-0.5 opacity-90">
            BY
          </span>
          <span className="linocut-3d-vermillion text-base sm:text-2xl md:text-3xl font-black uppercase tracking-wider px-0.5">
            MILESTONE.
          </span>
        </div>

        {/* Formal Stage-Gate Ribbon */}
        <div className="mt-4 sm:mt-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FAF6EC] border border-[#0D2B1D] text-[10px] sm:text-xs font-black tracking-widest text-[#0D2B1D] shadow-2xs uppercase">
            • STAGE-GATE VERIFICATION • PAYPAL SANDBOX ESCROW •
          </span>
        </div>
      </div>
    </div>
  );
}
