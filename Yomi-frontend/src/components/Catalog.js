import React, { useState, useEffect } from "react";
import Navigator from "./Navigator";
import Card from "./skeletons/Card";
import SearchBox from "./skeletons/SearchBox";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Catalog() {
  const [mangaData, setMangaData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  useEffect(() => {
    fetchManga();
  }, []);

  const fetchManga = async () => {
    try {
      const response = await fetch("https://yomi-backend.vercel.app/manga/", {
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
      setMangaData(Array.isArray(data) ? data : [data]);
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const search = async () => {
    try {
      console.log(searchTerm);
      const response = await fetch(
        `https://yomi-backend.vercel.app/manga/title/${searchTerm}`,
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
      setMangaData(Array.isArray(data) ? data : [data]);
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="">
      <header>
        <Navigator />
      </header>
      <div className="w-full bg-background flex justify-center">
        <div className="w-full flex justify-center flex-row">
          <Form.Control
            className={`w-2/3 text-white align-middle justify-center ${
              isActive ? "bg-background" : ""
            }`}
            size="lg"
            type="text"
            placeholder="Search for Manga"
            data-bs-theme="dark "
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="px-3 py-2 ml-2 bg-secondary border-none active:bg-primary"
            onClick={() => {
              search();
            }}
          >
            <img src="/search_icon.svg" className="w-7" />
          </Button>
        </div>
      </div>
      <div className="w-full p-10 h-full flex flex-wrap bg-background">
        {mangaData.map((manga) => (
          <Card
            key={manga._id}
            title={manga.title}
            author={manga.author}
            image={manga.image}
            id={manga._id}
          />
        ))}
      </div>
    </div>
  );
}
