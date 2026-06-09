import React from 'react'

export function BoyAvatar({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="boyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      {/* Background */}
      <circle cx="50" cy="50" r="50" fill="url(#boyGrad)" />
      {/* Ears */}
      <circle cx="28" cy="55" r="7" fill="#fbcfe8" />
      <circle cx="72" cy="55" r="7" fill="#fbcfe8" />
      {/* Face */}
      <path d="M 30,55 A 20,20 0 0,0 70,55 L 70,50 L 30,50 Z" fill="#fbcfe8" />
      <circle cx="50" cy="52" r="18" fill="#fbcfe8" />
      {/* Hair */}
      <path d="M 28,45 C 25,30 35,15 50,15 C 65,15 75,30 72,45 C 68,38 60,35 50,38 C 40,35 32,38 28,45 Z" fill="#1e293b" />
      {/* Eyes */}
      <circle cx="43" cy="50" r="2.5" fill="#0f172a" />
      <circle cx="57" cy="50" r="2.5" fill="#0f172a" />
      {/* Eyebrows */}
      <path d="M 38,45 Q 43,43 47,46" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 62,45 Q 57,43 53,46" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Smile */}
      <path d="M 44,60 Q 50,65 56,60" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="36" cy="56" r="3" fill="#f472b6" opacity="0.4" />
      <circle cx="64" cy="56" r="3" fill="#f472b6" opacity="0.4" />
      {/* Shirt Collar */}
      <path d="M 38,82 L 50,70 L 62,82 Z" fill="#ffffff" />
      <path d="M 50,70 L 50,85" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  )
}

export function GirlAvatar({ className = "w-full h-full" }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="girlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      {/* Background */}
      <circle cx="50" cy="50" r="50" fill="url(#girlGrad)" />
      {/* Ponytail Back Hair */}
      <circle cx="24" cy="65" r="10" fill="#78350f" />
      <circle cx="76" cy="65" r="10" fill="#78350f" />
      {/* Ears */}
      <circle cx="29" cy="56" r="6.5" fill="#ffe4e6" />
      <circle cx="71" cy="56" r="6.5" fill="#ffe4e6" />
      {/* Face */}
      <path d="M 30,56 A 20,20 0 0,0 70,56 L 70,50 L 30,50 Z" fill="#ffe4e6" />
      <circle cx="50" cy="53" r="18" fill="#ffe4e6" />
      {/* Hair front */}
      <path d="M 28,45 C 28,25 35,18 50,18 C 65,18 72,25 72,45 C 68,40 60,38 50,42 C 40,38 32,40 28,45 Z" fill="#78350f" />
      {/* Hair bangs overlay */}
      <path d="M 28,45 C 32,32 42,30 48,38 C 50,30 65,30 72,45 C 68,43 62,44 58,45 Q 50,40 42,45 C 36,44 32,43 28,45 Z" fill="#451a03" />
      {/* Eyes */}
      <circle cx="43" cy="50" r="2.5" fill="#0f172a" />
      <circle cx="57" cy="50" r="2.5" fill="#0f172a" />
      {/* Lashes */}
      <path d="M 40,47 Q 43,45 45,48" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 60,47 Q 57,45 55,48" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Smile */}
      <path d="M 45,60 Q 50,64 55,60" stroke="#be123c" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Pink Blushing Cheeks */}
      <circle cx="35" cy="56" r="4" fill="#fb7185" opacity="0.6" />
      <circle cx="65" cy="56" r="4" fill="#fb7185" opacity="0.6" />
      {/* Shirt collar */}
      <path d="M 38,82 C 42,76 46,72 50,72 C 54,72 58,76 62,82 Z" fill="#ffffff" />
      {/* Necklace */}
      <circle cx="50" cy="71" r="2" fill="#fbbf24" />
    </svg>
  )
}

export function RenderAvatar({ avatar, className = "w-10 h-10 rounded-full", name = "" }) {
  let activeAvatar = avatar;
  
  if (!activeAvatar || activeAvatar.startsWith("http")) {
    const parts = (name || "").toLowerCase().trim().split(/\s+/);
    const firstName = parts[0] || "";
    // Simple heuristic for female first names
    if (
      firstName.endsWith("a") || 
      firstName.endsWith("i") || 
      firstName.endsWith("y") || 
      firstName.endsWith("preet") ||
      firstName.endsWith("deep") ||
      firstName.endsWith("kaur") ||
      firstName.endsWith("devi") ||
      firstName.endsWith("kumari")
    ) {
      activeAvatar = "girl";
    } else {
      activeAvatar = "boy";
    }
  }

  if (activeAvatar === "boy") {
    return (
      <div className={`${className} bg-blue-50 border-2 border-blue-200 overflow-hidden flex items-center justify-center select-none`}>
        <BoyAvatar />
      </div>
    )
  }

  if (activeAvatar === "girl") {
    return (
      <div className={`${className} bg-pink-50 border-2 border-pink-200 overflow-hidden flex items-center justify-center select-none`}>
        <GirlAvatar />
      </div>
    )
  }

  return (
    <img
      src={activeAvatar}
      alt={name || "User Profile"}
      className={`${className} object-cover`}
    />
  )
}
