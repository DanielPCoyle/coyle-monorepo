import React from 'react';
import Link from 'next/link';
import axios from 'axios';

export const LinkPreview = ({message}) => {
    const hasLink = message.message.includes("http");
    const [loading, setLoading] = React.useState(hasLink);
    const [urlPreview, setUrlPreview] = React.useState(null);

    React.useEffect(() => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.message.match(urlRegex);
        if (urls && urls.length > 0) {
            axios.get(`/api/url-preview?url=${urls[0]}`)
                .then(response => {
                    setUrlPreview(response.data);
                    setTimeout(() => setLoading(false), 500);
                })
                .catch(error => {
                    console.error("Error fetching URL metadata:", error);
                    setLoading(false);
                });
        }
    }, [message.message]);

    if(loading){
        return <div style={{overflow:"hidden"}}><div className="animate__animated animate__fadeInLeft animate__infinite">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
        </div>
        </div>
    }
    return  Boolean(urlPreview && hasLink) &&  <Link href={urlPreview.url} target="_blank" style={{ color: "blue" }}>
    <div className="urlPreview" style={{ marginTop: "10px", border: "1px solid #ccc", borderRadius: "10px", padding: "10px" }}>
        <div style={{ fontWeight: "bold" }}>{urlPreview.title}</div>
        <div>{urlPreview.description}</div>
        {urlPreview.image && <img src={urlPreview.image} alt="preview" style={{ width: "45%", margin: "auto", borderRadius: "10px" }} />}
        <div className="small">Link: {urlPreview.url}</div>
    </div>
</Link>
}