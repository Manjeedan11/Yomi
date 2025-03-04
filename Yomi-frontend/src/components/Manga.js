import React, { useEffect, useState } from "react";
import Navigator from "./Navigator";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function Manga() {
  //get book id from path variable
  const { id } = useParams();
  const [mangaData, setMangaData] = useState({});
  const [admin, setAdmin] = useState(false);
  const fetchInfo = async () => {
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
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const checkIfAdmin = async () => {
    try {
      const response = await fetch(
        `https://yomi-backend.vercel.app/admin/checkAdmin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            withCredentials: "true",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Not admin");
        setAdmin(false);
        return;
      }

      const data = await response.json();
      setAdmin(true);
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleDelete = async () => {
    //get confirmation first
    if (
      !window.confirm(
        "Are you sure you want to delete this manga? This action cannot be undone"
      )
    ) {
      return;
    }
    try {
      const response = await fetch(
        `https://yomi-backend.vercel.app/manga/${mangaData._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            withCredentials: "true",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Failed to delete manga");
        return;
      }

      const data = await response.json();
      console.log(data);
      window.location.href = "/catalog";
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleAddtoCollections = async () => {
    try {
      const response = await fetch(
        "https://yomi-backend.vercel.app/collections",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            withCredentials: "true",
          },
          body: JSON.stringify({
            mangaId: mangaData._id,
          }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.error("Failed to add manga");
        return;
      } else {
        alert("Manga added to collection");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchInfo();
    checkIfAdmin();
  }, []);

  return (
    <div>
      <Navigator />
      <div className="max-w-3xl mx-auto p-6 bg-background shadow-md rounded-md shadow-gray-900">
        <div className="flex items-start space-x-6">
          {/* Book Image */}
          <div className="flex-shrink-0">
            <img src={mangaData.image} className="w-40 h-auto rounded-md" />
          </div>

          {/* Book Details */}
          <div className="flex-1">
            {/* Book Title */}
            <h1 className="text-5xl text-warm font-bold tracking-wider">
              {mangaData.title}
            </h1>

            {/* Author, Genres, Demographics */}
            <div className="flex items-start flex-col space-x-2 mt-2 text-white">
              <p className="text-4xl text-gray-400">{mangaData.author}</p>
              <br />
              <p>
                <strong className="text-highlight">Genres</strong>{" "}
                {mangaData.genre}
              </p>
              <br />
              <p>
                <strong className="text-highlight">Demographics</strong>{" "}
                {mangaData.demographic}
              </p>
            </div>

            {/* Description */}
            <div className="mt-4 text-white">
              <h2 className="text-lg font-semibold text-highlight">Synopsis</h2>
              <p className="mt-2">{mangaData.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center mt-2 space-x-2">
        <Button
          className="bg-background border-secondary"
          onClick={handleAddtoCollections}
        >
          Add to collection
        </Button>
        <a href="/catalog">
          <Button className="bg-background border-none">search for more</Button>
        </a>

        {admin && (
          <div>
            <a href={`/admin/add/${mangaData._id}`}>
              <Button className="bg-background border-secondary mr-2">
                Edit info
              </Button>
            </a>
            <Button
              className="bg-background border-highlight"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
