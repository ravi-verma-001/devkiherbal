'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function ShilajitCompetitorSections() {
  return (
    <div className="w-full mt-16 space-y-16">
      
      {/* SECTION 1: STAMINA LEVEL DROPPING WITH AGE */}
      <section className="bg-white rounded-[32px] p-6 md:p-12 shadow-sm border border-slate-100 overflow-hidden">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl md:text-4xl font-black italic tracking-wide text-gray-900 uppercase">
            Stamina Level <br className="md:hidden" /> Dropping With Age
          </h2>
        </div>

        {/* Dynamic SVG Chart */}
        <div className="w-full overflow-x-auto scrollbar-hide py-4">
          <div className="min-w-[640px] max-w-[800px] mx-auto relative px-4">
            <svg
              viewBox="0 0 800 450"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto select-none"
            >
              {/* Definitions for patterns, gradients and clips */}
              <defs>
                {/* Grid Pattern */}
                <pattern id="chartGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" strokeWidth="1" />
                </pattern>

                {/* Stamina Curve Clip Path */}
                <clipPath id="staminaCurveClip">
                  <path
                    d="M 100,100 
                       C 200,100 240,115 320,180 
                       C 400,245 440,280 520,310 
                       C 600,340 640,350 720,350 
                       L 720,380 
                       L 100,380 
                       Z"
                  />
                </clipPath>

                {/* Body Silhouette Symbol */}
                <g id="humanSilhouette">
                  <path
                    d="M50,48 c6.6,0,12-5.4,12-12s-5.4-12-12-12s-12,5.4-12,12S43.4,48,50,48z 
                       M68,54H32c-5.5,0-10,4.5-10,10v48c0,3.3,2.7,6,6,6h4v72c0,5.5,4.5,10,10,10h4
                       c5.5,0,10-4.5,10-10v-56h8v56c0,5.5,4.5,10,10,10h4c5.5,0,10-4.5,10-10v-72h4
                       c3.3,0,6-2.7,6-6V64C78,58.5,73.5,54,68,54z"
                  />
                </g>
              </defs>

              {/* Grid Background */}
              <rect x="80" y="50" width="660" height="330" fill="url(#chartGrid)" />

              {/* Y Axis Line */}
              <line x1="100" y1="50" x2="100" y2="380" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
              {/* X Axis Line */}
              <line x1="100" y1="380" x2="740" y2="380" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

              {/* X Axis Ticks & Grid Labels */}
              {[
                { val: '20', x: 100 },
                { val: '30', x: 220 },
                { val: '40', x: 340 },
                { val: '50', x: 460 },
                { val: '60', x: 580 },
                { val: '70', x: 700 }
              ].map((tick) => (
                <g key={tick.val}>
                  <line x1={tick.x} y1="380" x2={tick.x} y2="390" stroke="#000000" strokeWidth="3" />
                  <text
                    x={tick.x}
                    y="420"
                    fill="#000000"
                    fontSize="24"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {tick.val}
                  </text>
                </g>
              ))}

              {/* "Age" label in the middle of X axis numbers */}
              <text x="400" y="445" fill="#333333" fontSize="16" fontWeight="bold" textAnchor="middle">
                Age
              </text>

              {/* Y Axis Label */}
              <text
                x="50"
                y="215"
                fill="#333333"
                fontSize="18"
                fontWeight="bold"
                textAnchor="middle"
                transform="rotate(-90 50 215)"
              >
                Stamina Level
              </text>

              {/* BACKGROUND SILHOUETTES (Above curve - Light Beige) */}
              {[160, 280, 400, 520, 640].map((x, idx) => (
                <use
                  key={`bg-sil-${idx}`}
                  href="#humanSilhouette"
                  x={x - 50}
                  y={380 - 195}
                  fill="#F0E5D3"
                  transform={`scale(1)`}
                />
              ))}

              {/* STAMINA SHADED AREA (Tan/Beige fill under the curve) */}
              <path
                d="M 100,100 
                   C 200,100 240,115 320,180 
                   C 400,245 440,280 520,310 
                   C 600,340 640,350 720,350 
                   L 720,380 
                   L 100,380 
                   Z"
                fill="#E8DCB9"
                fillOpacity="0.85"
              />

              {/* FOREGROUND SILHOUETTES (Under curve - Dark Tan/Gold, Clipped to curve) */}
              <g clipPath="url(#staminaCurveClip)">
                {[160, 280, 400, 520, 640].map((x, idx) => (
                  <use
                    key={`fg-sil-${idx}`}
                    href="#humanSilhouette"
                    x={x - 50}
                    y={380 - 195}
                    fill="#B09363"
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Infographic Labels / Footer */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3">
            {/* Running Rabbit Icon */}
            <span className="text-3xl">🐇</span>
            <p className="text-sm md:text-base font-bold text-gray-800">
              Stamina Declines By Up To <span className="text-black font-extrabold">2% Annually After Age 30</span>
            </p>
          </div>
          <div className="hidden md:block h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <p className="text-sm md:text-base font-bold text-gray-800">
              Years Which Can Be Increased By <span className="text-black font-extrabold">20% With Shilajit Intake.*</span>
            </p>
            {/* Slow Turtle Icon */}
            <span className="text-3xl">🐢</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: GUMMY EQUIVALENCE INFOGRAPHIC */}
      <section className="bg-white rounded-[32px] py-10 px-6 md:px-12 shadow-sm border border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          
          {/* Left: Gummies */}
          <div className="flex items-center gap-6 group">
            <div className="relative">
              {/* Beige Circle Background */}
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-[#E8DCB9] flex items-center justify-center shadow-inner relative transition-transform duration-300 group-hover:scale-105">
                {/* Glossy SVG 3D Gummies */}
                <div className="absolute left-[-15px] top-[-10px] w-24 h-24 drop-shadow-[0_10px_15px_rgba(0,0,0,0.45)]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <radialGradient id="gummyGloss1" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#802030" />
                        <stop offset="30%" stopColor="#4A0512" />
                        <stop offset="85%" stopColor="#1E0005" />
                        <stop offset="100%" stopColor="#050001" />
                      </radialGradient>
                      <linearGradient id="gummyHighlight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Shadow layer */}
                    <circle cx="50" cy="53" r="42" fill="#000" opacity="0.3" />
                    {/* Main Gummy Sphere */}
                    <circle cx="50" cy="50" r="42" fill="url(#gummyGloss1)" />
                    {/* White Gloss Accent */}
                    <ellipse cx="38" cy="30" rx="16" ry="8" fill="url(#gummyHighlight)" transform="rotate(-30 38 30)" />
                  </svg>
                </div>

                <div className="absolute left-[15px] top-[25px] w-24 h-24 drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Shadow layer */}
                    <circle cx="50" cy="53" r="42" fill="#000" opacity="0.35" />
                    {/* Main Gummy Sphere */}
                    <circle cx="50" cy="50" r="42" fill="url(#gummyGloss1)" />
                    {/* White Gloss Accent */}
                    <ellipse cx="38" cy="30" rx="16" ry="8" fill="url(#gummyHighlight)" transform="rotate(-30 38 30)" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-5xl font-black text-black leading-none">2</span>
              <span className="text-lg font-bold text-gray-700 mt-1 uppercase tracking-wide">Gummies</span>
            </div>
          </div>

          {/* Equals Sign */}
          <div className="text-5xl md:text-7xl font-extrabold text-black select-none leading-none">
            =
          </div>

          {/* Right: Resin Bowl */}
          <div className="flex items-center gap-6 group">
            {/* Beige Circle Background */}
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-[#E8DCB9] flex items-center justify-center shadow-inner relative transition-transform duration-300 group-hover:scale-105">
              {/* Resin Bowl Image */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white shadow-lg relative bg-white">
                <img
                  src="/banner/shilijit1.jpeg"
                  alt="Shilajit Resin"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-5xl font-black text-black leading-none">400</span>
              <span className="text-lg font-bold text-gray-700 mt-1 uppercase tracking-wide leading-tight">
                mg Shilajit <br /> Resin
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: EFFECTIVE INGREDIENTS */}
      <section className="bg-white rounded-[32px] p-6 md:p-12 shadow-sm border border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Effective Ingredients in Shilajit Gummies
          </h2>
          <p className="text-base md:text-lg font-semibold text-amber-800 tracking-wide">
            Clinically Formulated for Best Results For You!
          </p>
        </div>

        {/* 5-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Shilajit Resin */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
              <img src="/banner/shilijit2.jpeg" alt="Himalayan Shilajit Resin" className="w-full h-full object-cover" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-extrabold text-base md:text-lg text-gray-900 tracking-wide uppercase mb-1">
                Himalayan Shilajit Resin
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                It is commonly used in Ayurvedic medicine, contains antioxidants and raises energy levels, improving vitality. It helps overcome health problems & boosts strength & stamina.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Swarna Bhasma */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop"
                alt="Swarna Bhasma"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-extrabold text-base md:text-lg text-gray-900 tracking-wide uppercase mb-1">
                Swarna Bhasma
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                An Ayurvedic medicine that enhances immunity, improves performance, and supports overall health.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Ashwagandha */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop"
                alt="Ashwagandha"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-extrabold text-base md:text-lg text-gray-900 tracking-wide uppercase mb-1">
                Ashwagandha
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                Is known for its anti-inflammatory and antioxidant effects, it helps recover muscles and enhances stamina. It is a powerful adaptogen that reduces stress and anxiety.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Black Musli */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=200&h=200&fit=crop"
                alt="Black Musli"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-extrabold text-base md:text-lg text-gray-900 tracking-wide uppercase mb-1">
                Black Musli
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                It improves physical endurance, increases blood flow and treats urinary problems. Its strength-enhancing properties make it beneficial for overall health.
              </p>
            </div>
          </motion.div>

          {/* Card 5: Ginger */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:col-span-2 lg:max-w-2xl lg:mx-auto lg:w-full"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&h=200&fit=crop"
                alt="Ginger"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-extrabold text-base md:text-lg text-gray-900 tracking-wide uppercase mb-1">
                Ginger
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                It increases blood flow, which may help enhance immunity. It also prevents blood clots and helps dilate blood vessels, accelerating nutrient absorption throughout the body.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 4: WHAT TO EXPECT (TIMELINE & BADGES) */}
      <section className="rounded-[32px] overflow-hidden relative shadow-lg text-white">
        
        {/* Background dark mountain image overlay */}
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549880180-4c6d485a87d3?w=1200&fit=crop&q=80')" }}>
          {/* Dark Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/75" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-8 md:p-14 text-center">
          
          <div className="mb-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
              WHAT TO EXPECT?
            </h2>
            <p className="text-base md:text-lg font-bold text-gray-300">
              Daily Dosage: 2 Gummy Per Day
            </p>
            <p className="text-xs md:text-sm text-[#DEC9A0] font-bold mt-1">
              *If you are a beginner start with 1 gummy per day
            </p>
          </div>

          {/* Timeline tracker */}
          <div className="max-w-4xl mx-auto relative px-4 py-8 mb-12">
            {/* Horizontal timeline line (desktop) */}
            <div className="absolute top-[28px] left-[16.6%] right-[16.6%] border-t-[3px] border-white/20 z-0 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative z-10">
              
              {/* Day 15 */}
              <div className="flex flex-col items-center">
                {/* Circular indicator with Checkmark */}
                <div className="bg-[#B09363] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-[3px] border-white mb-4 relative">
                  <Check className="w-6 h-6 stroke-[3]" />
                  {/* Vertical connector line (mobile) */}
                  <div className="absolute bottom-[-40px] left-1/2 w-[3px] h-10 bg-white/25 md:hidden" />
                </div>
                <h3 className="text-[#DEC9A0] font-black text-xl md:text-2xl uppercase tracking-wider mb-2">
                  DAY 15
                </h3>
                <p className="text-sm md:text-base font-extrabold text-white leading-tight uppercase max-w-[200px]">
                  IMPROVES STAMINA, <br /> ENHANCES ENERGY
                </p>
              </div>

              {/* Day 30 */}
              <div className="flex flex-col items-center">
                {/* Circular indicator with Checkmark */}
                <div className="bg-[#B09363] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-[3px] border-white mb-4 relative">
                  <Check className="w-6 h-6 stroke-[3]" />
                  {/* Vertical connector line (mobile) */}
                  <div className="absolute bottom-[-40px] left-1/2 w-[3px] h-10 bg-white/25 md:hidden" />
                </div>
                <h3 className="text-[#DEC9A0] font-black text-xl md:text-2xl uppercase tracking-wider mb-2">
                  DAY 30
                </h3>
                <p className="text-sm md:text-base font-extrabold text-white leading-tight uppercase max-w-[200px]">
                  IMPROVES IMMUNITY, <br /> ENHANCES COGNITIVE FOCUS
                </p>
              </div>

              {/* Day 45 */}
              <div className="flex flex-col items-center">
                {/* Circular indicator with Checkmark */}
                <div className="bg-[#B09363] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-[3px] border-white mb-4">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-[#DEC9A0] font-black text-xl md:text-2xl uppercase tracking-wider mb-2">
                  DAY 45
                </h3>
                <p className="text-sm md:text-base font-extrabold text-white leading-tight uppercase max-w-[240px]">
                  INCREASES BLOOD FLOW, <br /> INCREASE NUTRIENT ABSORPTION
                </p>
              </div>

            </div>

            <p className="text-[10px] text-gray-400 mt-8 text-right italic font-medium">
              *Based On Shilajit Studies
            </p>
          </div>

          {/* Bottom Badges Section */}
          <div className="border-t border-white/10 pt-8 mt-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 max-w-4xl mx-auto">
            
            {/* Badge 1: Ayurveda */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl md:text-4xl">🥣</span>
              <div className="text-left">
                <span className="block text-[10px] uppercase text-gray-400 font-bold tracking-wider leading-none">Powered By</span>
                <span className="text-base md:text-lg font-black tracking-wider uppercase">AYURVEDA</span>
              </div>
            </div>

            {/* Badge 2: No Added Sugar */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl md:text-4xl font-light">🚫🍬</span>
              <div className="text-left">
                <span className="text-sm md:text-base font-black tracking-wide uppercase leading-tight">NO ADDED SUGAR</span>
              </div>
            </div>

            {/* Badge 3: Gluten Free */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl md:text-4xl">🌾</span>
              <div className="text-left">
                <span className="text-sm md:text-base font-black tracking-wide uppercase leading-tight">GLUTEN FREE</span>
              </div>
            </div>

            {/* Badge 4: 100% Pure */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl md:text-4xl">✨</span>
              <div className="text-left">
                <span className="block text-[13px] font-black text-[#DEC9A0] leading-none">100% PURE</span>
                <span className="text-sm md:text-base font-black uppercase tracking-tight">Himalayan Shilajit Resin</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
