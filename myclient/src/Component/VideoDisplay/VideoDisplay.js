import React from "react";

function VideoDisplay({ src, title }) {
  return (
    <div style={{ padding: "52.73% 0 0", position: "relative" }}>
      <iframe
        src={src}
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        title={title}
      ></iframe>
    </div>
  );
}

export default VideoDisplay;
