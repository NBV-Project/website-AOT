"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroBackgroundVideoProps = {
  className?: string;
  src: string;
  poster?: string;
};

export function HeroBackgroundVideo({ className, src, poster }: HeroBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.playbackRate = 0.72;

    const handleReady = () => {
      setIsVideoReady(true);
    };

    if (video.readyState >= 3) { // Have enough data to play
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => {
        setIsVideoReady(true);
      });
    } else {
      video.addEventListener("loadeddata", handleReady, { once: true });
      video.addEventListener("canplay", handleReady, { once: true });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Ignore autoplay failures.
          });
          // Do not disconnect, we might need to play/pause later if needed, 
          // but user wants it simple. 
          // Actually, let's keep it simple.
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("canplay", handleReady);
    };
  }, [src]);

  return (
    <>
      {poster ? (
        <Image
          src={poster}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className={`${className ?? ""} absolute inset-0 transition-opacity duration-700 ${
            isVideoReady ? "opacity-0" : "opacity-100"
          }`}
        />
      ) : null}
      <video
        ref={videoRef}
        autoPlay
        className={`${className ?? ""} transition-opacity duration-1000 ${
          isVideoReady ? "opacity-100" : "opacity-0"
        }`}
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={src} type="video/mp4" />
      </video>
    </>
  );
}
