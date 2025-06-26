import React from "react";

interface YouTubeVideoProps {
  videoId: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  mute?: boolean;
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
  videoId,
  title,
  className = "",
  autoPlay = false,
  mute = false,
}) => {
  const src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${
    autoPlay ? "&autoplay=1" : ""
  }${mute ? "&mute=1" : ""}`;

  return (
    <div className={`relative aspect-video ${className}`}>
      <iframe
        id={`youtube-player-${videoId}`}
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
};

export default YouTubeVideo;