export async function preprocessFiles(files: any[]) {
  const fileContents = await Promise.all(
    files.map(async (file) => {
      if (file.download_url) {
        const response = await fetch(file.download_url);
        return await response.text();
      }
      return "";
    })
  );
  return fileContents.join("\n\n");
}
