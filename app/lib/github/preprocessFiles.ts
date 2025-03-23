// app/lib/github/preprocessFiles.ts
export async function preprocessFiles(files: any[]) {
  const fileContents = await Promise.all(
    files.map(async (file) => {
      if (file.type === "file" && file.download_url) {
        const response = await fetch(file.download_url);
        return await response.text();
      }
      return "";
    })
  );

  const content = fileContents.join("\n\n");
  return content || "No code files found in the repository."; // Fallback
}
