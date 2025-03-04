import React, { useState } from "react";
import Joi from "joi"; // Import Joi for validation
import Cookies from "js-cookie";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const schema = Joi.object({
    username: Joi.string()
      .regex(/^[a-zA-Z0-9_]{3,30}$/)
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
      }),
    passwordConfirm: Joi.any().valid(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match", // Custom error message if passwords don't match
    }),
  });

  const validate = () => {
    const { error: validationError } = schema.validate({
      username,
      email,
      password,
      passwordConfirm,
    });

    if (validationError) {
      setError(validationError.details[0].message);
      return false;
    }

    setError(""); // Clear any previous errors if validation passes
    return true;
  };

  const fetchRegister = async () => {
    if (validate()) {
      // Proceed with registration logic
      try {
        const response = await fetch(
          "https://yomi-backend.vercel.app/api/user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              withCredentials: "true",
            },
            body: JSON.stringify({
              username: username,
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
          Cookies.set("username", username);
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
        src="/register_cover.jpg"
        className="object-cover h-full w-full fixed top-0"
        alt="image background"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black"></div>

      <div className="absolute inset-y-0 right-0 w-1/3 bg-background bg-opacity-100 flex flex-col items-center justify-center  rounded-l-lg mt-4 mb-4 mr-8">
        <h1 className="text-7xl text-midnight">Register</h1>

        <br />
        <br />
        <form className="flex flex-col space-y-5 w-2/3 ">
          <input
            type="text"
            className="px-10 py-6 border border-gray-600 bg-background rounded-md text-gray-100 focus:outline-none focus:border-midnight-dark"
            placeholder="Username"
            required={true}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            className="px-10 py-6 border border-gray-600 bg-background rounded-md text-gray-100 focus:outline-none focus:border-midnight-dark"
            placeholder="Email"
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="px-10 py-5 border border-gray-600 rounded-md bg-background text-gray-100 focus:outline-none focus:border-midnight-dark"
            placeholder="Password"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            className="px-10 py-5 border border-gray-600 rounded-md bg-background text-gray-100 focus:outline-none focus:border-midnight-dark"
            placeholder="Confirm Password"
            required={true}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <input
            type="submit"
            className="px-4 py-5 bg-midnight-dark text-white rounded-md mt-4 cursor-pointer"
            value="Register"
            onClick={(e) => {
              e.preventDefault();
              fetchRegister();
            }}
          />
        </form>
        <p className="error">{error}</p>
        <a href="/login" className="text-midnight-dark text-s underline pt-2">
          login instead
        </a>
        <a href="/" className="text-midnight-dark text-xs underline pt-2">
          return home
        </a>
      </div>
      <div className="absolute bottom-0 left-0 p-4 text-gray-100 text-sm">
        © Artwork by{" "}
        <a href="https://www.pixiv.net/en/artworks/113600258">void_0</a>
      </div>
    </div>
  );
}
