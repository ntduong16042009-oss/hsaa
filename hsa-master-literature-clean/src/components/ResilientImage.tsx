import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel = 'HSA MASTER · Ngữ Văn',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#10243A] via-[#173252] to-[#0B1524] text-[#D6B978] p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-10 h-10 mb-2 opacity-85" />
        <span className="text-xs font-medium tracking-wider text-white/80">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
