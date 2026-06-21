import ApiConfig from "./ApiConfig";
export default async function Logout(headers) {
  deleteAllCookies();
  window.location.replace("/");

  const payload = null;
  try {
    await ApiConfig.post("/logout", payload, { headers }).then((response) => {
      return;
    });
  } catch (error) {
    console.log(error);
  }
}

function deleteAllCookies() {
  // Get all cookies
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];

    // Get the cookie name
    const cookieName = cookie.split("=")[0].trim();

    // Set the cookie with an expiration date
    document.cookie =
      cookieName + "=; expires=Thu, 01 Jan 2025 00:00:00 GMT; path=/";
  }
}
