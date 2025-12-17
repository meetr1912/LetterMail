import React, { useState, useEffect, useRef } from 'react';

import { Search, PenTool, X, Flame, Reply, Send, ArrowLeft, Cloud } from 'lucide-react';

// --- MOCK DATA ---

const EMAILS = [
  {
    id: 1,
    read: false,
    sender: "Karl Architects",
    address: "124 Bowery, NY",
    initials: "KA",
    stampColor: "bg-[#8B4513]",
    subject: "Sunday Plans",
    date: "Oct 14",
    preview: "Regarding our coffee meeting...",
    body: `My Dear Mit,

It has been far too long since we last spoke properly. I was walking through the Lower East Side yesterday and stumbled upon that small jazz café we used to talk about—the one with the velvet curtains.

Are we still on for coffee this Sunday? I would love to hear your thoughts on the new drafts. I believe we have finally cracked the facade issue, but I need your eye on it before we present to the board.

Yours truly,`,
    signature: "Karl"
  },
  {
    id: 2,
    read: false,
    sender: "Elara Studio",
    address: "44 West St, LDN",
    initials: "ES",
    stampColor: "bg-[#2F4F4F]", 
    subject: "Draft Concept III",
    date: "Oct 13",
    preview: "The latest renders attached.",
    body: `To the attention of Mit,

We have updated the renders based on your feedback from Tuesday. The lighting has been adjusted to feel more "afternoon sun" rather than "clinical bright". 

I think you will appreciate how the shadows fall across the texture of the wall now—it feels much more tangible, almost touchable. Please review the attached sheets when you have a quiet moment.

Sincerely,`,
    signature: "Elara Design Team"
  },
  {
    id: 3,
    read: true,
    sender: "Mother",
    address: "Vermont, USA",
    initials: "M",
    stampColor: "bg-[#556B2F]", 
    subject: "The Antique Table",
    date: "Oct 10",
    preview: "I found the one...",
    body: `Dearest Mit,

I was walking past that shop on 4th street today and I saw it. The oak table with the specific legs you mentioned last Christmas. 

I took a picture, but honestly, the camera doesn't do it justice. It has that lovely worn feeling, like it has been used for writing letters for a hundred years. The wood is warm and smooth to the touch.

I asked them to hold it until tomorrow. Call me when you are free?

Love,`,
    signature: "Mom"
  },
  {
    id: 4,
    read: true,
    sender: "Gallery 42",
    address: "Paris, FR",
    initials: "G42",
    stampColor: "bg-[#800000]", 
    subject: "Exhibition Invite",
    date: "Oct 09",
    preview: "Private View Invitation...",
    body: `Dear Patron,

We are delighted to invite you to the private view of 'Silent Spaces', a new exhibition by Sarah Jenkins. Her work explores the quiet moments in urban environments.

The curator has set aside a catalogue for you at the front desk. Drinks will be served from 7pm. We hope to see you there.

Regards,`,
    signature: "The Gallery"
  }
];

// --- STYLES & ANIMATIONS ---

const styles = `
  /* --- BURN ANIMATION --- */
  
  /* The "Mask" that eats the paper */
  @keyframes burnMask {
    0% { -webkit-mask-position: 100% 100%; mask-position: 100% 100%; }
    100% { -webkit-mask-position: -50% -50%; mask-position: -50% -50%; }
  }
  /* The "Char" edge that precedes the burn */
  @keyframes charEdge {
    0% { opacity: 0; transform: translate(0, 0); }
    20% { opacity: 1; }
    100% { opacity: 0; transform: translate(-300px, -300px); }
  }
  /* Realistic Fire Animations - Enhanced */
  @keyframes fireEngulf {
    0% { transform: translateY(100%) scale(0.8) rotate(0deg); opacity: 0; }
    3% { opacity: 0.2; }
    8% { opacity: 0.5; transform: translateY(70%) scale(1.0) rotate(-1deg); }
    15% { opacity: 0.9; transform: translateY(50%) scale(1.2) rotate(-2deg); }
    30% { opacity: 1; transform: translateY(20%) scale(1.5) rotate(-3deg); }
    50% { opacity: 1; transform: translateY(-20%) scale(1.8) rotate(-5deg); }
    70% { opacity: 0.9; transform: translateY(-50%) scale(2.0) rotate(-6deg); }
    100% { transform: translateY(-100%) scale(2.5) rotate(-8deg); opacity: 0.4; }
  }
  
  @keyframes flameFlicker {
    0%, 100% { transform: scaleY(1) scaleX(1) translateX(0) rotate(0deg); opacity: 1; }
    10% { transform: scaleY(1.15) scaleX(0.92) translateX(-3px) rotate(-1deg); opacity: 0.95; }
    20% { transform: scaleY(0.92) scaleX(1.08) translateX(3px) rotate(1deg); opacity: 1; }
    30% { transform: scaleY(1.08) scaleX(0.96) translateX(-2px) rotate(-0.5deg); opacity: 0.98; }
    40% { transform: scaleY(0.96) scaleX(1.04) translateX(2px) rotate(0.5deg); opacity: 1; }
    50% { transform: scaleY(1.12) scaleX(0.94) translateX(-2.5px) rotate(-1deg); opacity: 0.97; }
    60% { transform: scaleY(0.94) scaleX(1.06) translateX(2.5px) rotate(1deg); opacity: 1; }
    70% { transform: scaleY(1.06) scaleX(0.98) translateX(-1.5px) rotate(-0.5deg); opacity: 0.99; }
    80% { transform: scaleY(0.98) scaleX(1.02) translateX(1.5px) rotate(0.5deg); opacity: 1; }
    90% { transform: scaleY(1.04) scaleX(0.99) translateX(-1px) rotate(-0.3deg); opacity: 0.98; }
  }
  
  @keyframes flameRise {
    0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; }
    5% { opacity: 0.3; }
    10% { opacity: 1; transform: translateY(-5px) scale(1.05) rotate(-1deg); }
    30% { transform: translateY(-20px) scale(1.15) rotate(-2deg); opacity: 0.95; }
    50% { transform: translateY(-40px) scale(1.2) rotate(-3deg); opacity: 0.9; }
    70% { transform: translateY(-60px) scale(1.1) rotate(-4deg); opacity: 0.7; }
    100% { transform: translateY(-100px) scale(0.8) rotate(-6deg); opacity: 0; }
  }
  
  @keyframes emberGlow {
    0%, 100% { opacity: 0.9; transform: scale(1); filter: brightness(1) drop-shadow(0 0 3px rgba(255,140,0,0.8)); }
    25% { opacity: 1; transform: scale(1.15); filter: brightness(1.4) drop-shadow(0 0 6px rgba(255,200,0,1)); }
    50% { opacity: 1; transform: scale(1.2); filter: brightness(1.5) drop-shadow(0 0 8px rgba(255,220,0,1)); }
    75% { opacity: 0.95; transform: scale(1.1); filter: brightness(1.3) drop-shadow(0 0 5px rgba(255,180,0,0.9)); }
  }
  
  @keyframes emberFloat {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
    20% { transform: translate(-8px, -20px) rotate(72deg); opacity: 1; }
    40% { transform: translate(-18px, -50px) rotate(144deg); opacity: 0.9; }
    60% { transform: translate(-28px, -80px) rotate(216deg); opacity: 0.7; }
    80% { transform: translate(-36px, -110px) rotate(288deg); opacity: 0.4; }
    100% { transform: translate(-45px, -140px) rotate(360deg); opacity: 0; }
  }
  
  @keyframes sparkPop {
    0% { transform: scale(0) rotate(0deg); opacity: 0; }
    10% { transform: scale(1.5) rotate(180deg); opacity: 1; }
    30% { transform: scale(1) rotate(360deg); opacity: 1; }
    100% { transform: scale(0.3) rotate(720deg); opacity: 0; }
  }
  
  @keyframes smokeRise {
    0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); opacity: 0.7; }
    15% { transform: translateY(-20px) translateX(5px) scale(1.1) rotate(5deg); opacity: 0.8; }
    30% { transform: translateY(-50px) translateX(12px) scale(1.3) rotate(10deg); opacity: 0.85; }
    50% { transform: translateY(-100px) translateX(20px) scale(1.6) rotate(15deg); opacity: 0.7; }
    70% { transform: translateY(-150px) translateX(25px) scale(2.0) rotate(20deg); opacity: 0.5; }
    100% { transform: translateY(-250px) translateX(35px) scale(3.0) rotate(25deg); opacity: 0; }
  }
  
  @keyframes charSpread {
    0% { transform: scale(0.5); opacity: 0; }
    10% { opacity: 0.2; }
    20% { opacity: 0.4; transform: scale(0.8); }
    40% { opacity: 0.6; transform: scale(1.1); }
    60% { opacity: 0.7; transform: scale(1.3); }
    100% { transform: scale(1.8); opacity: 0.85; }
  }
  
  @keyframes heatDistortion {
    0%, 100% { transform: translateY(0) scaleY(1) scaleX(1); opacity: 0.4; }
    25% { transform: translateY(-3px) scaleY(1.08) scaleX(0.98); opacity: 0.5; }
    50% { transform: translateY(-6px) scaleY(1.12) scaleX(0.96); opacity: 0.6; }
    75% { transform: translateY(-3px) scaleY(1.06) scaleX(0.99); opacity: 0.5; }
  }
  
  @keyframes paperBurnEdge {
    0% { opacity: 0; transform: scaleX(0); }
    20% { opacity: 0.3; }
    40% { opacity: 0.6; transform: scaleX(0.5); }
    60% { opacity: 0.8; transform: scaleX(0.8); }
    100% { opacity: 1; transform: scaleX(1); }
  }
  
  /* CSS-Only Fire Animation using glitter texture - Ultra realistic */
  @keyframes cssFire {
    0% {
      background-position: center 0px, center 0px, 50% 100%, center center;
    }
    100% {
      background-position: center -500px, center -650px, 50% 100%, center center;
    }
  }
  
  .css-fire-base {
    position: absolute;
    inset: 0;
    background-image: 
      url("https://assets.codepen.io/13471/silver-glitter-background.png"),
      url("https://assets.codepen.io/13471/silver-glitter-background.png"),
      linear-gradient(
        0deg,
        white 0px,
        #ff8951 5px,
        #dcbc169c 30%,
        transparent 70%
      ),
      radial-gradient(ellipse at bottom, transparent 30%, black 60%);
    background-size: 350px 500px, 400px 650px, 100% 100%, 100% 100%;
    background-blend-mode: hard-light, color-dodge, multiply;
    background-position: center 0px, center 0px, 50% 100%, center center;
    background-repeat: repeat, repeat, repeat, no-repeat;
    mix-blend-mode: color-dodge;
    filter: brightness(3.7) blur(7px) contrast(6);
    animation: cssFire 1.75s linear infinite;
    box-shadow: inset 0 -40px 50px -60px #63bbc5;
    pointer-events: none;
    z-index: 51;
    transform-origin: bottom right;
  }
  
  .css-fire-base::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: 
      url("https://assets.codepen.io/13471/silver-glitter-background.png"),
      linear-gradient(
        0deg,
        rgba(255,255,255,0.8) 0px,
        #ff6b00 8px,
        #ff4500 25%,
        #dc2626 50%,
        transparent 75%
      );
    background-size: 300px 450px, 100% 100%;
    background-blend-mode: screen, multiply;
    background-position: center 0px, 50% 100%;
    background-repeat: repeat, no-repeat;
    mix-blend-mode: screen;
    filter: brightness(2.5) blur(5px) contrast(4);
    animation: cssFire 1.5s linear infinite reverse;
    opacity: 0.7;
  }
  .burning-container {
    /* Create a jagged burn edge using a gradient mask */
    -webkit-mask-image: radial-gradient(circle at bottom right, transparent 30%, black 50%);
    mask-image: radial-gradient(circle at bottom right, transparent 30%, black 50%);
    -webkit-mask-size: 200% 200%;
    mask-size: 200% 200%;
    -webkit-mask-position: 0% 0%; /* Start fully visible */
    mask-position: 0% 0%;
  }
  .burning-active {
    animation: burnMask 2.5s forwards linear;
  }
  /* --- FOLD ANIMATION (ENHANCED) --- */
  
  /* Simulates the paper lifting slightly, creasing, and then dropping back */
  @keyframes fold3D {
    0% { 
      transform: perspective(1000px) rotateX(0deg) translateY(0) scale(1); 
      opacity: 1; 
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }
    /* Anticipation: slight tilt towards user before fold */
    15% { 
      transform: perspective(1000px) rotateX(8deg) translateY(-8px) scale(1.02); 
      opacity: 1;
      box-shadow: 0 30px 60px -12px rgba(0,0,0,0.3);
    }
    30% { 
      transform: perspective(1000px) rotateX(5deg) translateY(-20px) scale(1.02); 
      opacity: 1;
    }
    /* Snap back and fold */
    40% { 
      transform: perspective(1000px) rotateX(-20deg) translateY(10px) scale(0.95); 
      opacity: 1;
      box-shadow: 0 20px 40px -12px rgba(0,0,0,0.2);
    }
    100% { 
      /* The snap away */
      transform: perspective(1000px) rotateX(-30deg) translateY(400px) scale(0.7); 
      opacity: 0; 
      box-shadow: 0 0 0 0 transparent;
    }
  }

  /* Animate shadow creases appearing as the paper bends */
  @keyframes creaseAppear {
    0% { opacity: 0; transform: scaleX(0.8); }
    30% { opacity: 0; }
    40% { opacity: 0.6; transform: scaleX(1); }
    70% { opacity: 0.8; }
    100% { opacity: 0; transform: scaleX(1.1); }
  }

  .folding-active {
    transform-origin: center bottom;
    animation: fold3D 0.8s forwards cubic-bezier(0.5, 0, 0.2, 1);
    position: relative;
  }

  /* Crease lines with bevel effect - First crease at 1/3 mark */
  .folding-active::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 33.33%;
    height: 2px;
    pointer-events: none;
    z-index: 100;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(0,0,0,0.15) 10%,
      rgba(0,0,0,0.25) 50%,
      rgba(0,0,0,0.15) 90%,
      transparent 100%
    );
    box-shadow: 
      0 1px 2px rgba(0,0,0,0.1) inset,
      0 -1px 1px rgba(255,255,255,0.3) inset;
    animation: creaseAppear 0.8s forwards ease-in;
  }

  /* Second crease at 2/3 mark - tri-fold effect */
  .folding-active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 66.66%;
    height: 2px;
    pointer-events: none;
    z-index: 100;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(0,0,0,0.15) 10%,
      rgba(0,0,0,0.25) 50%,
      rgba(0,0,0,0.15) 90%,
      transparent 100%
    );
    box-shadow: 
      0 1px 2px rgba(0,0,0,0.1) inset,
      0 -1px 1px rgba(255,255,255,0.3) inset;
    animation: creaseAppear 0.8s forwards ease-in 0.05s;
  }
  
  /* Custom Scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(120, 113, 108, 0.2);
    border-radius: 20px;
  }
`;

// --- COMPONENTS ---

const WaxSeal = ({ active }) => (
  <div className={`
    w-12 h-12 rounded-full bg-red-900 shadow-md flex items-center justify-center relative
    border-4 border-red-800/80
    ${active ? 'opacity-100' : 'opacity-80'}
  `}>
    <div className="absolute inset-0 rounded-full border border-red-950/30 opacity-50"></div>
    <div className="text-red-950/60 font-serif font-bold text-xs italic">Post</div>
  </div>
);

const PostageStamp = ({ color, initials, isRead }) => (
  <div className={`
    w-14 h-16 shadow-sm relative overflow-hidden flex flex-col items-center justify-center
    border-2 border-dashed border-white/30
    transition-all duration-500
    ${color}
    ${isRead ? 'brightness-90 grayscale-[0.3]' : 'brightness-110 shadow-md'}
  `}>
    {/* Stamp Content */}
    <div className="text-white/90 font-serif font-bold text-lg relative z-10">{initials}</div>
    
    {/* Perforations */}
    <div className="absolute -bottom-3 -right-3 w-10 h-10 border border-black/20 rounded-full"></div>
    <div className="absolute -bottom-3 -right-3 w-10 h-10 border border-black/20 rounded-full translate-x-1"></div>
    {/* CANCELLATION MARK (Only if Read) */}
    {isRead && (
      <div className="absolute inset-0 pointer-events-none opacity-80 mix-blend-multiply">
          <svg className="absolute top-0 left-0 w-full h-full text-black/60" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M-10,20 Q10,10 30,20 T70,20 T110,20" fill="none" stroke="currentColor" strokeWidth="2" />
             <path d="M-10,35 Q10,25 30,35 T70,35 T110,35" fill="none" stroke="currentColor" strokeWidth="2" />
             <path d="M-10,50 Q10,40 30,50 T70,50 T110,50" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="absolute -top-2 -right-2 w-10 h-10 border-2 border-black/60 rounded-full flex items-center justify-center transform rotate-12">
             <span className="text-[6px] font-bold text-black/60">OCT 14</span>
          </div>
      </div>
    )}
  </div>
);

const RealisticFire = () => {
  // Generate consistent random values for particles
  const getRandom = (seed, min, max) => {
    const x = Math.sin(seed) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-sm">
      {/* CSS-Only Fire Base Layer - Ultra realistic using glitter texture */}
      <div className="css-fire-base" style={{
        transform: 'scale(1.3) translate(8%, 5%)',
        transformOrigin: 'bottom right',
        opacity: 0.95
      }} />
      
      {/* Enhanced Heat Distortion Layer - More intense */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at bottom right, transparent 0%, rgba(255,150,0,0.15) 30%, rgba(255,100,0,0.25) 50%, rgba(255,50,0,0.3) 70%)',
          animation: 'heatDistortion 0.25s infinite ease-in-out',
          mixBlendMode: 'overlay',
          filter: 'blur(2px)',
          zIndex: 52
        }}
      />
      
      {/* Base Fire Core - Intense orange/red center with better gradient */}
      <div 
        className="absolute w-[220%] h-[220%]"
        style={{ 
          bottom: '-60%', 
          right: '-60%',
          background: 'radial-gradient(ellipse, #ffd700 0%, #ff8c00 15%, #ff6b00 30%, #ff4500 45%, #dc2626 60%, #991b1b 75%, #7f1d1d 85%, transparent 100%)',
          animation: 'fireEngulf 2.5s forwards ease-out',
          mixBlendMode: 'hard-light',
          filter: 'blur(25px) brightness(1.1)'
        }}
      />
      
      {/* Secondary Fire Layer - More spread with yellow core */}
      <div 
        className="absolute w-[200%] h-[200%]"
        style={{ 
          bottom: '-50%', 
          right: '-50%',
          background: 'radial-gradient(ellipse, #ffed4e 0%, #ffd700 20%, #ff8c00 40%, #ff6b00 55%, #ff4500 70%, transparent 100%)',
          animation: 'fireEngulf 2.5s forwards ease-out 0.1s',
          mixBlendMode: 'screen',
          filter: 'blur(18px) brightness(1.15)'
        }}
      />
      
      {/* Tertiary Fire Layer - Outer glow */}
      <div 
        className="absolute w-[180%] h-[180%]"
        style={{ 
          bottom: '-40%', 
          right: '-40%',
          background: 'radial-gradient(ellipse, rgba(255,200,0,0.4) 0%, rgba(255,140,0,0.3) 30%, rgba(255,69,0,0.2) 60%, transparent 100%)',
          animation: 'fireEngulf 2.5s forwards ease-out 0.2s',
          mixBlendMode: 'screen',
          filter: 'blur(30px)'
        }}
      />
      
      {/* Charring/Ash Layer - Dark center spreading with more detail */}
      <div 
        className="absolute w-[170%] h-[170%]"
        style={{ 
          bottom: '-35%', 
          right: '-35%',
          background: 'radial-gradient(ellipse, #000000 0%, #1a0000 20%, #330000 40%, #4d0000 55%, #660000 70%, transparent 100%)',
          animation: 'charSpread 2.5s forwards ease-out',
          mixBlendMode: 'multiply',
          filter: 'blur(30px)',
          opacity: 0.8
        }}
      />
      
      {/* Paper Edge Burn Effect - Realistic charring at edge */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, transparent 55%, rgba(139,69,19,0.3) 65%, rgba(101,67,33,0.5) 75%, rgba(60,30,15,0.7) 85%, rgba(30,15,8,0.6) 92%, transparent 100%)',
          animation: 'paperBurnEdge 2.5s forwards ease-out',
          mixBlendMode: 'multiply',
          filter: 'blur(3px)'
        }}
      />
      
      {/* Main Flame Shapes - More realistic with better colors */}
      {[...Array(16)].map((_, i) => {
        const delay = i * 0.06;
        const rightOffset = getRandom(i, 15, 75);
        const size = getRandom(i + 100, 35, 85);
        const height = getRandom(i + 200, 70, 140);
        
        return (
          <div
            key={`flame-${i}`}
            className="absolute"
            style={{
              width: `${size}px`,
              height: `${height}px`,
              bottom: '0%',
              right: `${rightOffset}%`,
              background: `linear-gradient(to top, 
                #ffed4e 0%, 
                #ffd700 10%, 
                #ffb347 20%, 
                #ff8c00 35%, 
                #ff6b00 50%, 
                #ff4500 65%, 
                #dc2626 80%, 
                #991b1b 90%, 
                transparent 100%)`,
              clipPath: `polygon(${getRandom(i, 30, 70)}% 100%, ${getRandom(i+10, 0, 40)}% 85%, ${getRandom(i+20, 15, 55)}% 70%, ${getRandom(i+30, 25, 65)}% 50%, ${getRandom(i+40, 35, 75)}% 30%, ${getRandom(i+50, 40, 70)}% 15%, ${getRandom(i+60, 45, 55)}% 0%)`,
              animation: `flameRise ${getRandom(i+700, 1.2, 2.0)}s forwards ease-out ${delay}s, flameFlicker ${getRandom(i+800, 0.3, 0.5)}s infinite ease-in-out ${delay + 0.4}s`,
              transformOrigin: 'bottom center',
              filter: `blur(${getRandom(i+900, 1, 3)}px) brightness(${getRandom(i+1000, 1.0, 1.2)})`,
              opacity: 0,
              mixBlendMode: 'screen'
            }}
          />
        );
      })}
      
      {/* Large Flame Tongues - Dramatic upward flames with more detail */}
      {[...Array(10)].map((_, i) => {
        const delay = i * 0.08 + 0.15;
        const rightOffset = getRandom(i + 300, 20, 70);
        const width = getRandom(i + 400, 55, 110);
        const height = getRandom(i + 500, 120, 200);
        
        return (
          <div
            key={`tongue-${i}`}
            className="absolute"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              bottom: '0%',
              right: `${rightOffset}%`,
              background: `radial-gradient(ellipse at bottom, 
                #ffed4e 0%, 
                #ffd700 15%, 
                #ffb347 30%, 
                #ff8c00 45%, 
                #ff6b00 60%, 
                #ff4500 75%, 
                #dc2626 90%, 
                transparent 100%)`,
              clipPath: `polygon(${getRandom(i+600, 40, 60)}% 100%, ${getRandom(i+700, 15, 45)}% 75%, ${getRandom(i+800, 25, 55)}% 55%, ${getRandom(i+900, 30, 60)}% 35%, ${getRandom(i+1000, 35, 65)}% 20%, ${getRandom(i+1100, 40, 60)}% 8%, ${getRandom(i+1200, 45, 55)}% 0%)`,
              animation: `flameRise ${getRandom(i+1300, 1.8, 2.5)}s forwards ease-out ${delay}s, flameFlicker ${getRandom(i+1400, 0.4, 0.6)}s infinite ease-in-out ${delay + 0.7}s`,
              transformOrigin: 'bottom center',
              filter: `blur(${getRandom(i+1500, 2, 4)}px) brightness(${getRandom(i+1600, 1.1, 1.3)})`,
              opacity: 0,
              mixBlendMode: 'screen'
            }}
          />
        );
      })}
      
      {/* Ember Particles - Glowing hot embers with better physics */}
      {[...Array(40)].map((_, i) => {
        const delay = getRandom(i + 1000, 0, 1.2);
        const rightOffset = getRandom(i + 1100, 10, 80);
        const size = getRandom(i + 1200, 3, 14);
        const duration = getRandom(i + 1300, 2.5, 4.5);
        const glowSize = size * 2.5;
        
        return (
          <div
            key={`ember-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              bottom: '0%',
              right: `${rightOffset}%`,
              background: `radial-gradient(circle, #ffed4e 0%, #ffd700 30%, #ffb347 60%, #ff8c00 85%, #ff4500 100%)`,
              boxShadow: `
                0 0 ${glowSize}px rgba(255,215,0,0.9),
                0 0 ${glowSize * 1.5}px rgba(255,140,0,0.7),
                0 0 ${glowSize * 2}px rgba(255,69,0,0.5),
                inset 0 0 ${size * 0.5}px rgba(255,255,200,0.8)
              `,
              animation: `emberFloat ${duration}s forwards ease-out ${delay}s, emberGlow ${getRandom(i+1700, 0.6, 1.0)}s infinite ease-in-out ${delay + 0.2}s`,
              opacity: 0,
              filter: 'brightness(1.2)'
            }}
          />
        );
      })}
      
      {/* Spark Particles - Quick popping sparks */}
      {[...Array(20)].map((_, i) => {
        const delay = getRandom(i + 2000, 0.2, 1.5);
        const rightOffset = getRandom(i + 2100, 20, 70);
        const size = getRandom(i + 2200, 2, 6);
        const duration = getRandom(i + 2300, 0.4, 0.8);
        
        return (
          <div
            key={`spark-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              bottom: `${getRandom(i + 2400, 0, 15)}%`,
              right: `${rightOffset}%`,
              background: `radial-gradient(circle, #ffffff 0%, #ffed4e 50%, #ff8c00 100%)`,
              boxShadow: `0 0 ${size * 4}px rgba(255,215,0,1), 0 0 ${size * 6}px rgba(255,140,0,0.8)`,
              animation: `sparkPop ${duration}s forwards ease-out ${delay}s`,
              opacity: 0,
              filter: 'brightness(1.5)'
            }}
          />
        );
      })}
      
      {/* Smoke Particles - Multiple layers for depth */}
      {[...Array(15)].map((_, i) => {
        const delay = i * 0.15;
        const rightOffset = getRandom(i + 2000, 20, 70);
        const size = getRandom(i + 2100, 40, 100);
        const duration = getRandom(i + 2200, 3, 5);
        
        return (
          <div
            key={`smoke-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              bottom: '0%',
              right: `${rightOffset}%`,
              background: `radial-gradient(circle, rgba(100,100,100,0.4) 0%, rgba(60,60,60,0.3) 50%, transparent 100%)`,
              filter: 'blur(20px)',
              animation: `smokeRise ${duration}s forwards ease-out ${delay}s`,
              opacity: 0
            }}
          />
        );
      })}
      
      {/* Additional Smoke Wisp - Thin tendrils */}
      {[...Array(10)].map((_, i) => {
        const delay = i * 0.2 + 0.5;
        const rightOffset = getRandom(i + 3000, 25, 65);
        const width = getRandom(i + 3100, 30, 60);
        const height = getRandom(i + 3200, 80, 150);
        
        return (
          <div
            key={`wisp-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              bottom: '0%',
              right: `${rightOffset}%`,
              background: `radial-gradient(ellipse, rgba(120,120,120,0.3) 0%, rgba(80,80,80,0.2) 50%, transparent 100%)`,
              filter: 'blur(15px)',
              animation: `smokeRise ${getRandom(i + 3300, 4, 6)}s forwards ease-out ${delay}s`,
              opacity: 0,
              transform: `rotate(${getRandom(i + 3400, -20, 20)}deg)`
            }}
          />
        );
      })}
      
      {/* Paper Edge Glow - Where fire touches paper */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, transparent 60%, rgba(255,140,0,0.3) 70%, rgba(255,69,0,0.5) 80%, rgba(220,38,38,0.4) 90%, transparent 100%)',
          animation: 'fireEngulf 2.5s forwards ease-out',
          mixBlendMode: 'overlay',
          filter: 'blur(8px)'
        }}
      />
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [mails, setMails] = useState(EMAILS);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Helper for greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  // Bring clicked card to front
  const activateCard = (index, e) => {
    e?.stopPropagation();
    if (isAnimating) return;
    if (index === 0) {
      setIsOpen(true);
      // Mark as read when opened
      const newMails = [...mails];
      newMails[0].read = true;
      setMails(newMails);
      return;
    }
    setIsAnimating(true);
    const newMails = [...mails];
    const [selected] = newMails.splice(index, 1);
    newMails.unshift(selected);
    setMails(newMails);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleArchive = (e) => {
    if (e) e.stopPropagation();
    
    setIsOpen(false);
    setIsAnimating(true);
    
    setMails(prev => {
      const newArr = [...prev];
      const item = newArr.shift();
      // newArr.push(item); // Uncomment to cycle
      return newArr;
    });
    setIsAnimating(false);
  };

  if (mails.length === 0) {
    return (
      <div className="min-h-screen bg-[#E6E2D8] flex flex-col items-center justify-center font-serif text-[#5A5A5A]">
        <p className="italic text-xl opacity-60">All letters answered.</p>
        <button onClick={() => setMails(EMAILS)} className="mt-4 text-xs uppercase tracking-widest border-b border-stone-400 hover:text-black">
          Check Post
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#E6E2D8] text-[#2C2C2C] overflow-hidden relative font-serif">
      <style>{styles}</style>
      
      {/* 1. Background Layer */}
      <div className="absolute inset-0 bg-[#E6E2D8] z-0">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>
      {/* 2. UI Controls */}
      <div className={`absolute top-8 left-8 z-50 transition-opacity duration-700 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <h1 className="text-2xl italic font-serif text-stone-800 tracking-tight">The Letterbox</h1>
        <p className="text-xs font-sans uppercase tracking-widest text-stone-500 mt-1">
          {getGreeting()} Mit, you have {mails.length} new mails today.
        </p>
      </div>
      <div className={`absolute top-8 right-8 z-50 transition-opacity duration-700 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <div className="p-2 hover:bg-black/5 rounded-full cursor-pointer transition-colors">
            <Search className="w-5 h-5 text-stone-700" />
         </div>
      </div>
      <div className={`absolute bottom-8 left-8 z-50 transition-opacity duration-700 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <div className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-white shadow-lg">
                <PenTool size={16} />
            </div>
            <span className="text-sm italic text-stone-700">Write Letter</span>
         </div>
      </div>

      {/* 3. The Stack Container */}
      <div className="fixed inset-0 z-10 flex items-center justify-center perspective-[1200px] pointer-events-none">
        
        {mails.map((mail, index) => {
          const isTop = index === 0;
          
          let style = {};
          if (isOpen) {
             if (isTop) {
                 style = { transform: 'translateY(0) scale(1)', opacity: 1 };
             } else {
                 style = { transform: `translateY(${600 + (index * 50)}px) scale(0.9)`, opacity: 0 };
             }
          } else {
             const rot = (index % 2 === 0 ? 2 : -2) * index; 
             style = { 
                transform: `translateY(${index * 45}px) rotate(${rot}deg) scale(${1 - (index * 0.04)})`,
                opacity: index > 3 ? 0 : 1
             };
          }

          return (
            <div
              key={mail.id}
              onClick={(e) => activateCard(index, e)}
              className={`
                absolute transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${isOpen && !isTop ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'}
                ${!isTop && !isOpen ? 'hover:-translate-y-2' : ''}
              `}
              style={{
                zIndex: 40 - index, 
                ...style
              }}
            >
              <Envelope 
                data={mail} 
                isOpen={isOpen && isTop} 
                onClose={() => setIsOpen(false)} 
                onArchive={handleArchive}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- ENVELOPE / LETTER UNIT ---

const Envelope = ({ data, isOpen, onClose, onArchive }) => {
  const [isBurning, setIsBurning] = useState(false);
  const [isFolding, setIsFolding] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Handle resets when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsFolding(false);
        setIsBurning(false);
        setReplyMode(false);
      }, 700);
    }
  }, [isOpen]);

  const handleBurnClick = (e) => {
    e.stopPropagation();
    setIsBurning(true);
    
    // Increased duration to match the engulf animation
    setTimeout(() => {
      onArchive();
    }, 2400);
  };

  const handleFoldClick = (e) => {
    e.stopPropagation();
    setReplyMode(false);
    setIsFolding(true); // Triggers the 3D fold animation
    setTimeout(() => {
        onClose();
    }, 800); // Match fold animation duration
  };

  const handleReplyClick = (e) => {
    e.stopPropagation();
    setReplyMode(true);
  };

  const handleSendReply = (e) => {
    e.stopPropagation();
    setReplyText("");
    setIsFolding(true);
    setTimeout(() => {
        setReplyMode(false);
        onClose();
    }, 800); // Match fold animation duration
  };

  return (
    <div 
      className={`
        relative bg-[#F4F1EA] shadow-xl origin-center 
        flex flex-col overflow-hidden
        ${isBurning ? 'burning-active burning-container' : ''}
        ${isFolding ? 'folding-active' : 'transition-all duration-700'}
      `}
      style={{
        width: isOpen ? 'min(650px, 90vw)' : 'min(420px, 85vw)',
        height: isOpen ? '80vh' : '240px',
        borderRadius: '2px', 
        boxShadow: isOpen 
           ? '0 25px 50px -12px rgba(0,0,0,0.25)' 
           : '0 4px 10px -2px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
      }}
    >
        {isBurning && <RealisticFire />}
        {/* Paper Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-0"></div>

        {/* --- CLOSED STATE (The Envelope Back) --- */}
        <div className={`
             absolute inset-0 p-6 flex flex-col justify-between z-20 transition-all duration-500
             ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
            {/* Visual Flap */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-stone-200/20 clip-path-flap pointer-events-none" 
                 style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}>
            </div>
            
            <div className="flex justify-between items-start relative z-10">
                <div className="mt-2 ml-1">
                    <p className="font-serif text-[10px] uppercase tracking-widest text-stone-500 leading-relaxed">
                        From: {data.sender}<br/>{data.address}
                    </p>
                </div>
                <div className="transform rotate-3">
                    {/* Pass read status to stamp */}
                    <PostageStamp color={data.stampColor} initials={data.initials} isRead={data.read} />
                </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center bg-[#F4F1EA]/80 px-4 py-2 backdrop-blur-[1px] rounded border border-stone-200/50 shadow-sm transform -rotate-1">
                    <p className="font-serif text-xl italic text-stone-800">To Mit,</p>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400">Personal</p>
                 </div>
            </div>
            <div className="mt-auto border-t border-stone-300/30 pt-3 flex justify-between items-end relative z-10">
                <p className="font-serif text-sm italic text-stone-500 max-w-[70%] truncate">
                    Re: {data.subject}
                </p>
                <WaxSeal active={false} />
            </div>
        </div>

        {/* --- OPEN STATE (The Letter) --- */}
        <div className={`
             absolute inset-0 z-30 flex flex-col bg-[#FCFAF5] transition-all duration-700 delay-100
             ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
        `}>
            {/* Inner Paper Texture (Notebook Style) */}
            <div className="absolute inset-0 pointer-events-none" 
                 style={{ 
                    backgroundImage: `
                        linear-gradient(#E5E7EB 1px, transparent 1px), 
                        linear-gradient(90deg, transparent 60px, #FCA5A5 60px, #FCA5A5 61px, transparent 61px)
                    `,
                    backgroundSize: '100% 36px',
                    backgroundPosition: '0 8px' 
                 }}>
            </div>

            {/* Content Container (Main Letter or Reply UI) */}
            <div className="flex-1 overflow-hidden relative z-10">
                
                {/* 1. READING MODE */}
                <div className={`absolute inset-0 flex flex-col transition-transform duration-500 ${replyMode ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-20 py-16">
                        {/* Letterhead */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="font-serif text-2xl text-stone-900 font-bold tracking-tight">{data.sender}</h2>
                                <p className="text-[10px] font-sans uppercase tracking-widest text-stone-400 mt-1">{data.address}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-serif text-sm italic text-stone-500">{data.date}, 2024</p>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="font-serif text-lg leading-[36px] text-stone-800 space-y-9 relative">
                            {data.body.split('\n\n').map((para, i) => (
                                <p key={i} className={i === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:mt-[-4px]" : ""}>
                                    {para}
                                </p>
                            ))}
                        </div>
                        {/* Signature */}
                        <div className="mt-12 border-l border-stone-200">
                            <p className="font-serif italic text-stone-500 mb-4 pl-4">Warm regards,</p>
                            <p className="font-[cursive] text-3xl text-stone-900 transform -rotate-2 origin-left opacity-90 pl-4">{data.signature}</p>
                        </div>
                    </div>
                </div>

                {/* 2. REPLY MODE */}
                <div className={`absolute inset-0 flex flex-col bg-[#FCFAF5] transition-transform duration-500 ${replyMode ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                     <div className="flex items-center px-12 pt-10 pb-4 border-b border-stone-100">
                        <button onClick={() => setReplyMode(false)} className="text-stone-400 hover:text-stone-800 mr-4">
                            <ArrowLeft size={18} />
                        </button>
                        <p className="font-serif text-stone-600 italic">Replying to {data.sender}...</p>
                     </div>
                     <textarea 
                        className="flex-1 w-full bg-transparent px-20 py-12 font-serif text-lg leading-[36px] text-stone-800 outline-none resize-none placeholder:text-stone-300"
                        style={{
                            backgroundImage: `
                                linear-gradient(#E5E7EB 1px, transparent 1px), 
                                linear-gradient(90deg, transparent 60px, #FCA5A5 60px, #FCA5A5 61px, transparent 61px)
                            `,
                            backgroundSize: '100% 36px',
                            backgroundPosition: '0 8px',
                            backgroundAttachment: 'local'
                        }}
                        placeholder="Write your response here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus={replyMode}
                     />
                     <div className="p-8 flex justify-end">
                         <button onClick={handleSendReply} className="bg-stone-800 text-stone-100 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black transition-colors shadow-lg">
                             <span className="text-xs uppercase tracking-widest">Send Letter</span>
                             <Send size={14} />
                         </button>
                     </div>
                </div>
            </div>

            {/* Bottom Toolbar (Only visible in Read Mode) */}
            <div className={`h-16 border-t border-stone-100 bg-[#FCFAF5] flex items-center justify-center gap-8 shrink-0 z-20 transition-all duration-300 ${replyMode ? 'opacity-0 pointer-events-none translate-y-full' : 'opacity-100 translate-y-0'}`}>
                <button 
                  onClick={handleFoldClick} 
                  className="flex flex-col items-center gap-1 group text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                >
                    <X size={18} className="group-hover:scale-110 transition-transform"/>
                    <span className="text-[9px] uppercase tracking-widest">Fold</span>
                </button>
                <div className="w-px h-6 bg-stone-200"></div>
                <button 
                  onClick={handleReplyClick} 
                  className="flex flex-col items-center gap-1 group text-stone-400 hover:text-blue-900 transition-colors cursor-pointer"
                >
                    <Reply size={18} className="group-hover:scale-110 transition-transform"/>
                    <span className="text-[9px] uppercase tracking-widest">Reply</span>
                </button>
                <div className="w-px h-6 bg-stone-200"></div>
                <button 
                  onClick={handleBurnClick} 
                  className="flex flex-col items-center gap-1 group text-stone-400 hover:text-red-900 transition-colors cursor-pointer"
                >
                    <Flame size={18} className="group-hover:scale-110 transition-transform"/>
                    <span className="text-[9px] uppercase tracking-widest">Burn</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default App;

