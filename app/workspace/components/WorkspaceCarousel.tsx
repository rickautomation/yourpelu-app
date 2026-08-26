"use client";

import { useState, useEffect, ReactNode } from "react";

interface CarouselProps {
  children: ReactNode | ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

export function WorkspaceCarousel({ children, autoPlay = true, interval = 10000 }: CarouselProps) {
  const items = Array.isArray(children) ? children : [children];
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % items.length);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div>{items[current]}</div>

      {/* Indicadores */}
      <div className="flex justify-center mt-8 gap-2">
        {items.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === current ? "bg-pink-400" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
