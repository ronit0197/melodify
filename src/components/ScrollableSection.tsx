'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface ScrollableSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ScrollableSection({ title, children }: ScrollableSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-8">
      {/* Title + Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-1 md:p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
          >
            <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 md:p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
          >
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2 md:pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>

  );
}