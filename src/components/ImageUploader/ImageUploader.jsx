import React, { useEffect, useState } from "react";
import Spinner from "../Loader/Spinner";
//___ Icons ___//
import { RxCross2 } from "react-icons/rx";
import { IoMdCloudUpload } from "react-icons/io";

const ImageUploader = (props) => {
  const { img, setImg, width, height, icon } = props;
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setImg(file);
      console.log(file);

      // Simulate image upload
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
          setLoading(false);
        };
        reader.readAsDataURL(file);
      }, 1000); // Simulate a delay for upload
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImg(null);
  };

  useEffect(() => {
    if (img == null || img == "") {
      setImage(null);
      setImg(null);
    }
  }, [img]);

  const uploadLabelStyle = {
    ...styles.uploadLabel,
    width: width || "auto",
    height: height || "auto",
  };

  return (
    <div style={styles.container}>
      <label style={uploadLabelStyle}>
        {loading ? <Spinner /> : icon ? icon : <IoMdCloudUpload size={50} />}
        <input
          type="file"
          accept="image/*"
          multiple={true}
          onChange={handleImageUpload}
          style={styles.fileInput}
          disabled={loading}
        />
      </label>

      {image ? (
        <div style={styles.previewContainer}>
          <img src={image} alt="Preview" style={styles.imagePreview} />
          <hr style={styles.hr} />
          <RxCross2
            onClick={handleRemoveImage}
            style={styles.removeButton}
            size={25}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  uploadLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--main-clr)",
    border: "var(--table-border)",
    borderRadius: "10px",
    cursor: "pointer",
  },
  fileInput: {
    display: "none",
  },
  previewContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    // border: "var(--table-border)",
    // borderRadius: "10px",
    padding: "8px",
  },
  imagePreview: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
  },
  hr: {
    background: "var(--green)",
    flex: 1,
    height: "0.15rem",
  },
  removeButton: {
    background: "var(--red)",
    color: "#fff",
    // padding: "10px 20px",
    borderRadius: "5px",
    // border: "none",
    cursor: "pointer",
  },
};

export default ImageUploader;
