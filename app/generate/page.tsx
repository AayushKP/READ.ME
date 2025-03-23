"use client";

import { useState } from "react";
import { fetchRepoFiles } from "@/app/actions/github";
import MarkdownPreview from "@/app/components/MarkdownPreview";
import { preprocessFiles } from "@/app/lib/github/preprocessFiles";
import { generateReadme } from "@/app/lib/ai/generateReadme";

export default function Page() {
  const [repoUrl, setRepoUrl] = useState("");
  const [readme, setReadme] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log("🚀 Form submitted");

    setError("");
    setReadme("");
    setLoading(true);

    try {
      console.log("📄 Fetching repository files...");
      const repoFiles = await fetchRepoFiles(repoUrl);

      console.log("🔧 Preprocessing files...");
      const content = await preprocessFiles(repoFiles);

      console.log("📄 Generating README...");
      const generatedReadme = await generateReadme(content);

      console.log("✅ README Generated");
      setReadme(generatedReadme);
    } catch (error) {
      console.error("❌ Error:", error);
      setError(
        "Failed to generate README. Please check the repository URL and try again."
      );
    } finally {
      console.log("🏁 Process complete");
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center p-4 bg-black text-white">
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
          className="bg-blue-600 text-white rounded-xl h-10 flex items-center justify-center disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {readme && (
        <div className="mt-4 w-full max-w-3xl bg-gray-800 rounded-lg p-6">
          <MarkdownPreview content={readme} />
          <div className="flex gap-2 mt-4">
            <button
              className="bg-green-600 text-white rounded-lg px-4 py-2"
              onClick={() => navigator.clipboard.writeText(readme)}
            >
              Copy README
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
