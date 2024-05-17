import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthLayout({ children }) {
  const [authStatus, setAuthStatus] = useState(false);
  const Navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await fetch("/api/v1/users/getCurrentUser", {
        method: "GET",
      });
      const parseRes = await response.json();
      console.log(parseRes);
      setAuthStatus(true);
    } catch (err) {
      console.error(err.message);
      setAuthStatus(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return authStatus ? (
    <div>{children}</div>
  ) : (
    <div>
      Not Authorized
      <button
        className="bg-blue-500 mx-8 rounded-xl text-white text-xl px-2 py-3"
        onClick={() => Navigate("/login")}
      >
        Login
      </button>
    </div>
  );
}

export default AuthLayout;
