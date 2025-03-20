"use client";

import { useState } from "react";
import { fetchRepoFiles } from "@/app/actions/github";
import MarkdownPreview from "@/components/MarkdownPreview";
import FileList from "@/components/FIlelist";
import { preprocessFiles } from "../lib/github/preprocessFiles";
import { generateReadme } from "../lib/ai/generateReadme";

export default function Page() {
  const [repoUrl, setRepoUrl] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [readme, setReadme] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"preview" | "edit">("preview");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setFiles([]);
    setReadme("");
    setLoading(true);

    try {
      const repoFiles = await fetchRepoFiles(repoUrl);
      setFiles(repoFiles);

      const content = await preprocessFiles(repoFiles);
      const generatedReadme = await generateReadme(content);
      setReadme(generatedReadme);
    } catch (error) {
      setError("Failed to generate README.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col justify-center items-center p-4 bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full max-w-md"
      >
        <input
          className="border border-gray-700 rounded-lg h-10 p-2 bg-gray-800 text-white"
          type="text"
          placeholder="Enter GitHub repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded-xl h-10 flex items-center justify-center"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {files.length > 0 && (
        <div className="mt-4 w-full max-w-2xl bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Files:</h2>
          <FileList files={files} />
        </div>
      )}

      {readme && (
        <div className="mt-4 w-full max-w-2xl bg-gray-800 rounded-lg p-4">
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                mode === "preview" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setMode("preview")}
            >
              Preview
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                mode === "edit" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setMode("edit")}
            >
              Edit
            </button>
          </div>

          {mode === "preview" ? (
            <MarkdownPreview content={readme} />
          ) : (
            <textarea
              className="w-full h-96 p-2 bg-gray-700 text-white rounded-lg"
              value={readme}
              onChange={(e) => setReadme(e.target.value)}
            />
          )}

          <div className="flex gap-2 mt-4">
            <button
              className="bg-green-600 text-white rounded-lg px-4 py-2"
              onClick={() => navigator.clipboard.writeText(readme)}
            >
              Copy README
            </button>
            <button
              className="bg-purple-600 text-white rounded-lg px-4 py-2"
              onClick={() => {
                const blob = new Blob([readme], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "README.md";
                a.click();
              }}
            >
              Download README
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
