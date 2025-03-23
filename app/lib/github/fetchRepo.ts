"use server";

import { Octokit } from "@octokit/core";

interface GitHubContent {
  type: "file" | "dir";
  path: string;
  download_url?: string;
  [key: string]: any;
}

// app/actions/github.ts
export async function fetchRepoFiles(
  repoUrl: string,
  path: string = ""
): Promise<GitHubContent[]> {
  try {
    const urlParts = repoUrl.split("/");
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      { owner, repo, path }
    );

    if (!Array.isArray(response.data)) {
      throw new Error("Unexpected response format: expected an array.");
    }

    const files: GitHubContent[] = [];
    for (const item of response.data) {
      if (item.type === "dir") {
        // Recursively fetch files from subdirectories
        const subDirFiles = await fetchRepoFiles(repoUrl, item.path);
        files.push(...subDirFiles);
      } else {
        //@ts-ignore
        files.push(item);
      }
    }

    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw new Error("Failed to fetch repository files.");
  }
}
