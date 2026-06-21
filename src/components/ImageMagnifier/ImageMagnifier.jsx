import React, { useState } from "react";
import "./ImageMagnifier.css";

const ImageMagnifier = (props) => {
  const { src, width, height, zoom, bRadius } = props;

  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      className="magnifier-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        cursor: "zoom-in",
        borderRadius: bRadius,
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${src})`,
        backgroundSize: isHovering ? `${zoom * 100}%` : "cover",
        backgroundPosition: backgroundPosition,
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: `${width}px`,
          height: `${height}px`,
          cursor: "zoom-in",
          borderRadius: bRadius,
          visibility: isHovering ? "hidden" : "visible",
        }}
      />
    </div>
  );
};

export default ImageMagnifier;
