"use client";

import { useEffect, useRef } from "react";

type HeroBackgroundVideoProps = {
  className?: string;
  src: string;
  poster?: string;
};

export function HeroBackgroundVideo({ className, src, poster }: HeroBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.playbackRate = 0.72;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Ignore autoplay failures.
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      className={className}
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
