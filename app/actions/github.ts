"use server";

import { Octokit } from "@octokit/core";

interface GitHubContent {
  type: "file" | "dir";
  path: string;
  download_url?: string;
  size?: number;
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

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path,
      }
    );

    if (!Array.isArray(response.data)) {
      throw new Error("Unexpected response format: expected an array.");
    }

    console.log("Fetched Repository Files:", response.data); // Log fetched files
    return response.data as GitHubContent[];
  } catch (error: any) {
    console.error("Error fetching repository files:", error);
    throw new Error("Failed to fetch repository files.");
  }
}
