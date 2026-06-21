import CryptoJS from "crypto-js";
const secretKey = import.meta.env.VITE_SECRET_KEY;

// Encryption
export const Encryption = (txt, key) => {
  if (secretKey == key) {
    const encrypted = CryptoJS.AES.encrypt(String(txt), key).toString();
    return encrypted;
  } else {
    return "Key is not valid";
  }
};

// Decryption
export const Decryption = (encryptedTxt, key) => {
  if (secretKey == key) {
    const decrypted = CryptoJS.AES.decrypt(encryptedTxt, key).toString(
      CryptoJS.enc.Utf8
    );
    return decrypted;
  } else {
    return "Key is not valid";
  }
};
