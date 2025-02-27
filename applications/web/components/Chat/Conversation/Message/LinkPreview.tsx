import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

interface Message {
  message: string;
}

interface UrlPreview {
  url: string;
  type?: string;
  title?: string;
  description?: string;
  image?: string;
}

interface LinkPreviewProps {
  message: Message;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ message }) => {
  const hasLink = message.message.includes("http");
  const [loading, setLoading] = useState<boolean>(hasLink);
  const [urlPreview, setUrlPreview] = useState<UrlPreview | null>(null);

  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.message.match(urlRegex);

    if (urls && urls.length > 0) {
      const url = urls[0];

      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        setUrlPreview({ url, type: "youtube" });
        setLoading(false);
      } else {
        axios
          .get(`/api/url-preview?url=${url}`)
          .then((response) => {
            setUrlPreview(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching URL metadata:", error);
            setLoading(false);
          });
      }
    }
  }, [message.message]);

  if (loading) {
    return (
      <div style={{ overflow: "hidden" }}>
        <div className="animate__animated animate__fadeInLeft animate__infinite">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (urlPreview?.type === "youtube") {
    const videoId = urlPreview.url.includes("youtu.be")
      ? urlPreview.url.split("/").pop()
      : new URL(urlPreview.url).searchParams.get("v");
    return (
      <div style={{ marginTop: "10px" }}>
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    Boolean(urlPreview && hasLink) && (
      <Link href={urlPreview.url} target="_blank" style={{ color: "blue" }}>
        <div
          className="urlPreview"
          style={{
            marginTop: "10px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{urlPreview.title}</div>
          <div>{urlPreview.description}</div>
          {urlPreview.image && (
            <img
              src={urlPreview.image}
              alt="preview"
              style={{ width: "45%", margin: "auto", borderRadius: "10px" }}
            />
          )}
          <div className="small">Link: {urlPreview.url}</div>
        </div>
      </Link>
    )
  );
};
