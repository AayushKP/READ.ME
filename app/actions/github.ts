"use server";

import { Octokit } from "@octokit/core";

interface GitHubContent {
  type: "file" | "dir";
  path: string;
  download_url?: string;
  [key: string]: any;
}

export async function fetchRepoFiles(
  repoUrl: string,
  path: string = ""
): Promise<GitHubContent[]> {
  try {
    const urlParts = repoUrl.split("/");
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];

    console.log("Owner:", owner);
    console.log("Repo:", repo);
    console.log("Path:", path);

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Fetch repository contents
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path,
      }
    );

    console.log("API Response:", response);

    if (!Array.isArray(response.data)) {
      throw new Error("Unexpected response format: expected an array.");
    }

    return response.data as GitHubContent[];
  } catch (error: any) {
    console.error("Error fetching repository files:", error);

    if (error.status === 404) {
      throw new Error(
        "Repository or path not found. Ensure the repository exists and is not empty."
      );
    }

    throw new Error("Failed to fetch repository files.");
  }
}
