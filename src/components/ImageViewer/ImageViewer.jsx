import React from "react";
import { Image } from "antd";
import Skeleton from "@mui/material/Skeleton";

//___ Additional utility ___//
import { imgUrl } from "../../assets/js/ApiConfig";

const ImageViewer = (props) => {
  const { src, width, height, border, radius } = props;

  return (
    <>
      {src ? (
        <Image
          style={{
            width: width,
            height: height,
            border: border,
            borderRadius: radius,
          }}
          src={`${imgUrl}${src}`}
          placeholder={
            <Image
              preview={false}
              src={`${imgUrl}${src}`}
              style={{
                width: width,
                height: height,
                border: border,
                borderRadius: radius,
              }}
            />
          }
        />
      ) : (
        <Skeleton
          variant="rounded"
          animation="wave"
          width={width}
          height={height}
          sx={{
            bgcolor: "#0d0d0d33",
            border: "var(--table-border)",
            borderRadius: "0.5rem",
          }}
        />
      )}
    </>
  );
};
export default ImageViewer;
