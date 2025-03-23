const CODE_EXTENSIONS = [".js", ".ts", ".py", ".java", ".json"];

/**
 * Recursively fetches all files in a GitHub repository.
 * @param {string} repoUrl - GitHub API URL of the repository contents.
 * @returns {Promise<any[]>} - List of files with valid extensions.
 */
export async function fetchAllFiles(repoUrl: string): Promise<any[]> {
  try {
    const response = await fetch(repoUrl);

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed: ${response.status} ${response.statusText}`
      );
    }

    const files = await response.json();
    if (!Array.isArray(files)) {
      throw new Error("Unexpected response format from GitHub API");
    }

    const filePromises = files.map(async (file) => {
      if (file.type === "dir") {
        try {
          return await fetchAllFiles(file.url);
        } catch (err) {
          console.warn(`Skipping directory due to error: ${file.path}`, err);
          return [];
        }
      }
      return file;
    });

    // Resolve all file promises, flatten results, and remove duplicates
    const resolvedFiles = await Promise.allSettled(filePromises);
    const flattenedFiles = resolvedFiles
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => (result as PromiseFulfilledResult<any[]>).value);

    return [
      ...new Map(flattenedFiles.map((file) => [file.path, file])).values(),
    ];
  } catch (error) {
    console.error("Error fetching repository files:", error);
    return [];
  }
}

/**
 * Filters files based on predefined code extensions.
 * @param {any[]} files - List of GitHub repository files.
 * @param {boolean} isLargeRepo - Whether the repository is large.
 * @returns {any[]} - Filtered list of code files.
 */
export function filterFiles(files: any[], isLargeRepo: boolean): any[] {
  return files
    .filter(
      (file) =>
        file.type === "file" &&
        CODE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
    )
    .slice(0, isLargeRepo ? 100 : files.length); // Limit for large repos
}
