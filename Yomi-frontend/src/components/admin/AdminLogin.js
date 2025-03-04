import React, { useState } from "react";
import Joi from "joi";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
  });

  const validate = () => {
    const { error: validationError } = schema.validate({
      email,
    });

    if (validationError) {
      setError(validationError.details[0].message);
      return false;
    }

    setError(""); // Clear any previous errors if validation passes
    return true;
  };

  const fetchLogin = async () => {
    if (validate()) {
      try {
        const response = await fetch(
          "https://yomi-backend.vercel.app/admin/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              withCredentials: "true",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message);
          return;
        } else {
          Cookies.set("username", "admin");
          window.location.href = "/";
        }
      } catch (error) {
        // Handle fetch error (e.g., network error)
        console.error("Fetch error:", error);
        setError("An error occurred while processing your request.");
      }
    }
  };

  return (
    <div className="flex w-full h-full">
      <img
        src="/admin_login_cover.jpg"
        className="object-cover h-full w-full fixed top-0"
        alt="image background"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black"></div>

      <div className="absolute inset-y-0 right-0 w-1/3 bg-background bg-opacity-100 flex flex-col items-center justify-center  rounded-l-lg mt-4 mb-4 mr-8">
        <h1 className="text-7xl text-white">Admin</h1>

        <br />
        <br />
        <form className="flex flex-col space-y-5 w-2/3 ">
          <input
            type="text"
            className="px-10 py-6 border border-gray-600 bg-background rounded-md text-gray-100 focus:outline-none focus:border-white"
            placeholder="Email"
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />

          <input
            type="password"
            className="px-10 py-5 border border-gray-600 rounded-md bg-background text-gray-100 focus:outline-none focus:border-white"
            placeholder="Password"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />
          <input
            type="submit"
            className="px-4 py-5 bg-gray-500 text-white rounded-md mt-4 cursor-pointer"
            value="Login"
            onClick={(e) => {
              e.preventDefault();
              fetchLogin();
            }}
          />
        </form>
        <a className="error">{error}</a>
      </div>
      <div className="absolute bottom-0 left-0 p-4 text-gray-100 text-sm">
        © Artwork by{" "}
        <a href="https://www.pinterest.jp/pin/638174209694402624/">korigengi</a>
      </div>
    </div>
  );
}
