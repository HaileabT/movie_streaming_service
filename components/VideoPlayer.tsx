"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

declare global {
  interface Window {
    videojs: any;
  }
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load video.js dynamically
    const loadVideoJS = async () => {
      if (typeof window !== "undefined" && !window.videojs) {
        const videojs = await import("video.js");
        window.videojs = videojs.default;
      }
    };

    loadVideoJS().then(() => {
      if (videoRef.current && window.videojs) {
        // Initialize video.js player
        playerRef.current = window.videojs(videoRef.current, {
          controls: true,
          fluid: true,
          responsive: true,
          sources: [
            {
              src: `https://www.youtube.com/watch?v=${videoId}`,
              type: "video/youtube",
            },
          ],
        });

        // Add YouTube plugin if available
        if (window.videojs.getPlugin("youtube")) {
          playerRef.current.youtube({
            ytcontrols: 2,
            modestbranding: 1,
            rel: 0,
          });
        }
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoId]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} className="video-js vjs-default-skin" data-setup="{}">
          <p className="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5
            video.
          </p>
        </video>
      </div>
      <h2 className="text-xl font-semibold mt-4 mb-2">{title}</h2>
    </div>
  );
}
