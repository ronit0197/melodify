'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width = 200, 
  height = 200, 
  fill = false 
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ${className}`}>
        <span className="text-white text-xs">No Image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      onError={() => setError(true)}
      unoptimized
    />
  );
}