import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThreeDotsIcon } from "../../../svg/ThreeDotsIcon";

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
      <div data-testid="loading-indicator" style={{ overflow: "hidden" }}>
        <div className="animate__animated animate__fadeInLeft animate__infinite" data-testid="loading-state">
          <ThreeDotsIcon />
        </div>
      </div>
    );
  }

  if (urlPreview?.type === "youtube") {
    const videoId = urlPreview.url.includes("youtu.be")
      ? urlPreview.url.split("/").pop()
      : new URL(urlPreview.url).searchParams.get("v");

    return (
      <div data-testid="youtube-preview" style={{ marginTop: "10px" }}>
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
      <a
        href={urlPreview.url}
        target="_blank"
        style={{ color: "blue" }}
        data-testid="url-preview-link"
      >
        <div
          className="urlPreview"
          data-testid="url-preview-container"
          style={{
            marginTop: "10px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <div style={{ fontWeight: "bold" }} data-testid="url-preview-title">
            {urlPreview.title}
          </div>
          <div data-testid="url-preview-description">{urlPreview.description}</div>
          {urlPreview.image && (
            <img
              src={urlPreview.image}
              alt="preview"
              width={500}
              height={300}
              style={{ width: "45%", margin: "auto", borderRadius: "10px" }}
              data-testid="url-preview-image"
            />
          )}
          <div className="small" data-testid="url-preview-url">
            Link: {urlPreview.url}
          </div>
        </div>
      </a>
    )
  );
};
