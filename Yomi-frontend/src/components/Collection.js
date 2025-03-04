import React, { useEffect, useState } from "react";
import Navigator from "./Navigator";
import Card from "./skeletons/Card";

export default function Collection() {
    const [mangaData, setMangaData] = useState([]);

    const fetchCollection = async () => {
        try {
            const response = await fetch('http://localhost:5000/collections/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                console.error('Failed to fetch collection');
                return;
            }

            const data = await response.json();

            // Iterate over manga IDs and fetch detailed info for each manga
            const mangaDetailsPromises = data.map(async (mangaId) => {
                const mangaResponse = await fetch(`http://localhost:5000/manga/id/${mangaId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!mangaResponse.ok) {
                    console.error(`Failed to fetch manga with ID: ${mangaId}`);
                    return null;
                }

                return await mangaResponse.json();
            });

            // Wait for all manga details to be fetched
            const mangaDetails = await Promise.all(mangaDetailsPromises);

            // Filter out null values (failed fetches) and update mangaData state
            setMangaData(mangaDetails.filter((manga) => manga !== null));
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchCollection();
    }, []);

    return (
        <div className="">
            <header><Navigator /></header>
            <div className="w-full bg-background flex justify-center">
                {/* Add any header content here */}
            </div>
            <div className="w-full p-10 h-full flex flex-wrap bg-background">
                {mangaData.map((manga) => (
                    <Card
                        key={manga._id}
                        title={manga.title}
                        author={manga.author}
                        image={manga.image}
                        id={manga._id}
                        remove={true}
                    />
                ))}
            </div>
        </div>
    );
}
