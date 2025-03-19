"use client";

import { useState } from "react";
import { fetchRepoFiles } from "@/app/actions/github"; // Import the server action

export default function Page() {
  const [repoUrl, setRepoUrl] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setFiles([]);
    setLoading(true);

    try {
      const repoFiles = await fetchRepoFiles(repoUrl);

      console.log("Fetched files:", repoFiles);

      setFiles(repoFiles);
    } catch (error) {
      setError("Failed to fetch repository files.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col justify-center  items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full max-w-md"
      >
        <input
          className="border border-gray-300 rounded-lg h-10 p-2 text-white"
          type="text"
          placeholder="Enter GitHub repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white rounded-xl h-10 flex items-center justify-center"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {files.length > 0 && (
        <div className="border border-gray-300 rounded-lg p-4 mt-4 w-full max-w-md h-60 overflow-auto">
          <h2 className="text-lg font-bold mb-2">Files:</h2>
          <ul className="text-sm">
            {files.map((file, index) => (
              <li key={index} className="mb-1">
                📄 {file.path}{" "}
                {file.download_url && (
                  <a
                    href={file.download_url}
                    target="_blank"
                    className="text-blue-500"
                  >
                    [Download]
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
