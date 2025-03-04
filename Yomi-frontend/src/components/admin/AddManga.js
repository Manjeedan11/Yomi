import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Joi from "joi";

export default function AddManga() {
  const { id } = useParams();
  const [mangaData, setMangaData] = useState({});
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [demographic, setDemographic] = useState("");
  const [genres, setGenres] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  // Define Joi schema for validation
  const schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    demographic: Joi.string().required(),
    genres: Joi.string().required(),
    synopsis: Joi.string().required(),
    image: Joi.string().uri().required(), // Validate as a valid URI
  });

  const checkSession = async () => {
    try {
      const response = await fetch("https://yomi-backend.vercel.app/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch manga");
        return;
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchMangaInfo = async () => {
    console.log(id);
    try {
      const response = await fetch(
        `https://yomi-backend.vercel.app/manga/id/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch manga");
        return;
      }
      const data = await response.json();
      setMangaData(data);

      // Now update the state based on mangaData
      setTitle(data.title || ""); // Use default value '' if data.title is undefined
      setAuthor(data.author || "");
      setDemographic(data.demographic || "");
      setGenres(data.genre || "");
      setSynopsis(data.description || "");
      setImage(data.image || "");
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const validate = () => {
    console.log(title, author, demographic, genres, synopsis, image);

    const mangaInfo = { title, author, demographic, genres, synopsis, image };
    const { error: validationError } = schema.validate(mangaInfo);
    if (validationError) {
      setError(validationError.details[0].message);
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    checkSession();
    e.preventDefault();

    if (validate()) {
      try {
        const url = id
          ? `https://yomi-backend.vercel.app/manga/${id}`
          : "https://yomi-backend.vercel.app/manga";
        const method = id ? "PUT" : "POST";

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            withCredentials: "true",
          },
          body: JSON.stringify({
            title: title,
            author: author,
            demographic: demographic,
            genre: genres,
            description: synopsis,
            image: image,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message);
        } else {
          console.log("Manga updated successfully");
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while processing your request.");
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchMangaInfo();
    }
  }, [id]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center bg-background pt-10">
      <h1 className="text-6xl text-warm">Manga Info</h1>
      <br />
      <form className="flex flex-col space-y-5 w-2/3" onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-10 py-6 border border-gray-600 bg-background rounded-md text-gray-100 focus:outline-none focus:border-warm"
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="px-10 py-6 border border-gray-600 bg-background rounded-md text-gray-100 focus:outline-none focus:border-warm"
          placeholder="Author"
          required
        />
        <input
          type="text"
          value={demographic}
          onChange={(e) => setDemographic(e.target.value)}
          className="px-10 py-6 border border-gray-600 bg-background rounded-md text-gray-100 focus:outline-none focus:border-warm"
          placeholder="Demographic"
          required
        />
        <input
          type="text"
          value={genres}
          onChange={(e) => setGenres(e.target.value)}
          className="px-10 py-6 border border-gray-600 bg-background rounded-md text-gray-100 focus:outline-none focus:border-warm"
          placeholder="Genres"
          required
        />
        <textarea
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          className="px-10 py-6 border border-gray-600 bg-background rounded-md text-gray-100 focus:outline-none focus:border-warm"
          placeholder="Synopsis"
          required
        />
        <input
          type="url" // Use type "url" for image link
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="px-10 py-6 border border-gray-600 bg-background rounded-md text-gray-100 focus:outline-none focus:border-warm"
          placeholder="Image Link"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="submit"
          className="px-4 py-5 bg-warm text-white rounded-md mt-4 cursor-pointer"
          value="Submit"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
}
