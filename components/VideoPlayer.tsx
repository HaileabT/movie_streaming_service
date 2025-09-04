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
    const loadVideoJS = async () => {
      if (typeof window !== "undefined" && !window.videojs) {
        const videojs = await import("video.js");
        window.videojs = videojs.default;
      }
    };

    loadVideoJS().then(() => {
      if (videoRef.current && window.videojs) {
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
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoId]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Video container with theme styling */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin rounded-xl"
          data-setup="{}"
        >
          <p className="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading
            to a web browser that supports HTML5 video.
          </p>
        </video>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mt-6 text-red-500 text-center">
        {title}
      </h2>

      {/* Divider */}
      <div className="mt-4 h-[2px] w-24 mx-auto bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
    </div>
  );
}
