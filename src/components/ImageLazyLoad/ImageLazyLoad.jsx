import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Image = (props) => {
  const { src, width, height, alt } = props;
  return (
    <LazyLoadImage
      alt={alt}
      effect="blur"
      wrapperProps={{
        style: {
          transitionDelay: "1s",
          overflow: "hidden",
          width: width,
          height: height,
        },
      }}
      src={src}
    />
  );
};

export default Image;
