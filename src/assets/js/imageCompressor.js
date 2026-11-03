/**
 * Compress an image file using browser Canvas before upload.
 * Reduces large 5MB-15MB phone photos down to ~150KB-350KB while maintaining clarity.
 * Non-image files (like PDFs) are safely returned as-is.
 *
 * @param {File} file - The file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 1280)
 * @param {number} options.maxHeight - Maximum height (default: 1280)
 * @param {number} options.quality - Image quality 0.0 - 1.0 (default: 0.75)
 * @returns {Promise<File>} - Compressed File object
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve) => {
    if (!file) {
      return resolve(null);
    }

    // Do not compress non-image files (e.g. PDF documents)
    if (!file.type || !file.type.startsWith("image/")) {
      return resolve(file);
    }

    // If file is already smaller than 150KB, no need to compress further
    if (file.size <= 150 * 1024) {
      return resolve(file);
    }

    const { maxWidth = 1280, maxHeight = 1280, quality = 0.75 } = options;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale proportionally if dimensions exceed max
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(file);
      }

      // Draw white background in case of transparent png converting to jpeg
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file);
          }

          // If compressed blob is unexpectedly larger than original, keep original
          if (blob.size >= file.size) {
            return resolve(file);
          }

          // Construct clean filename with .jpg extension
          const originalBaseName = file.name.replace(/\.[^/.]+$/, "");
          const compressedFileName = `${originalBaseName}.jpg`;

          const compressedFile = new File([blob], compressedFileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          console.log(
            `[ImageCompressor] "${file.name}": ${(file.size / 1024).toFixed(1)} KB -> ${(compressedFile.size / 1024).toFixed(1)} KB`
          );

          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

export default compressImage;

