import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const MAX_URLS = 50;

export default function MultiTubeSyncPlayer() {
  const [urls, setUrls] = useState([""]);

  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addField = () => {
    if (urls.length < MAX_URLS) {
      setUrls([...urls, ""]);
    }
  };

  const clearAll = () => {
    setUrls([""]);
  };

  const extractVideoId = (url) => {
    try {
      const patterns = [
        /(?:youtube\.com\/watch\?v=)([\w-]{11})/, // watch?v=
        /(?:youtube\.com\/shorts\/)([\w-]{11})/,  // shorts/
        /(?:youtu\.be\/)([\w-]{11})/              // youtu.be/
      ];
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    } catch {
      return null;
    }
  };

  const postCommandToAll = (command) => {
    document.querySelectorAll("iframe").forEach((iframe) => {
      iframe.contentWindow.postMessage(
        `{"event":"command","func":"${command}","args":""}`,
        "*"
      );
    });
  };

  const playAll = () => postCommandToAll("playVideo");
  const pauseAll = () => postCommandToAll("pauseVideo");
  const syncAll = () => {
    postCommandToAll("stopVideo");
    setTimeout(() => {
      postCommandToAll("playVideo");
    }, 100);
  };

  const downloadURLs = () => {
    const blob = new Blob([urls.filter(Boolean).join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "youtube_urls.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🎬 MultiTube Sync Player</h1>
      <div className="space-y-2">
        {urls.map((url, index) => (
          <input
            key={index}
            type="text"
            placeholder="Enter YouTube video or shorts URL"
            className="w-full p-2 rounded border"
            value={url}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
        <div className="flex flex-wrap gap-2 pt-2">
          {urls.length < MAX_URLS && <Button onClick={addField}>+ Add Video</Button>}
          <Button variant="destructive" onClick={clearAll}>🗑️ Clear All</Button>
          <Button variant="outline" onClick={downloadURLs}>⬇️ Download URLs</Button>
        </div>
      </div>
      <div className="space-x-2 pt-2">
        <Button onClick={playAll}>▶️ Play All</Button>
        <Button onClick={pauseAll}>⏸️ Pause All</Button>
        <Button onClick={syncAll}>🔄 Sync All</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {urls.map((url, index) => {
          const videoId = extractVideoId(url);
          return (
            videoId && (
              <div key={index} className="aspect-video">
                <iframe
                  className="w-full h-full rounded"
                  src={\`https://www.youtube.com/embed/\${videoId}?enablejsapi=1&origin=\${window.location.origin}&modestbranding=1\`}
                  sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-forms"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}