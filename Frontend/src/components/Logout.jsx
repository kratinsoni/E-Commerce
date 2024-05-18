import React from "react";
import { BASE_URL } from "../constants.js";

const Logout = () => {
  const handleLogout = async () => {
    // Add your logout logic here
    await fetch(`${BASE_URL}/api/v1/users/logout`, {
      method: "POST",
      credentials: "same-origin",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // retrieve all cookies
        var Cookies = document.cookie.split(";");
        // set past expiry to all cookies
        for (var i = 0; i < Cookies.length; i++) {
          document.cookie =
            Cookies[i] + "=; expires=" + new Date(0).toUTCString();
        }
        window.localStorage.clear();
        window.location.href = "/login";
      })
      .catch((error) => console.error(error.message));
  };

  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default Logout;
