'use client';

import { motion } from 'framer-motion';

const goals = [
  {
    title: 'Get Clear\nSkin',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop&crop=faces',
  },
  {
    title: 'Get Healthy\nHair',
    image: 'https://images.unsplash.com/photo-1519764622345-23439dd774f7?w=400&h=400&fit=crop&crop=faces',
  },
  {
    title: 'Get Acne-\nFree Skin',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop&crop=faces',
  },
  {
    title: 'Get Healthy\nGut',
    image: '/banner/GutFix.png',
  }
];

export default function CategoryGoals() {
  return (
    <section className="pt-10 pb-4 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-4 md:gap-4 [&>div]:min-w-[240px] md:[&>div]:min-w-0 [&>div]:snap-center scrollbar-hide">
          {goals.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[16px] h-[90px] md:h-[100px] relative overflow-hidden flex items-center px-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              <h3 className="text-[15px] md:text-[16px] font-medium text-gray-800 z-10 whitespace-pre-line leading-snug tracking-wide">
                {goal.title}
              </h3>
              
              <div className="absolute right-0 bottom-0 h-full w-[55%]">
                 <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10 w-[40%]" />
                 <img 
                   src={goal.image} 
                   alt={goal.title.replace('\n', ' ')} 
                   className="w-full h-full object-cover object-right"
                 />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
