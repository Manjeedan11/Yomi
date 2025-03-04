import React from "react";

export default function Card(props) {
  const remove = async () => {
    try {
      const response = await fetch(
        `https://yomi-backend.vercel.app/collections/${props.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Failed to remove manga from collection");
        return;
      } else {
        window.location.href = "/collection";
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="w-1/5 h-1/5 m-4 border-secondary border-10 rounded">
      <img
        src={props.image}
        alt={props.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="font-bold text-midnight">{props.title}</h2>
        <p className="text-sm text-white">{props.author}</p>
        <a className="text-sm text-highlight" href={"/catalog/" + props.id}>
          more info
        </a>
        <br />
        {props.remove && (
          <button className="text-sm text-highlight" onClick={remove}>
            remove
          </button>
        )}

        {/*TODO: props.admin true? or admin true from cookies? render add and delete buttons */}
      </div>
    </div>
  );
}
