const CODE_EXTENSIONS = [
  ".js",
  ".ts",
  ".py",
  ".java",
  ".json",
  ".md",
  ".tsx",
  ".jsx",
];

async function fetchFilesRecursively(file: any) {
  if (
    file.type === "file" &&
    CODE_EXTENSIONS.some((ext) => file.name.endsWith(ext))
  ) {
    return [file];
  } else if (file.type === "dir") {
    // Fetch contents of the directory
    const response = await fetch(file.url);
    const subFiles = await response.json();

    // Recursively process subFiles
    const nestedFiles = await Promise.all(subFiles.map(fetchFilesRecursively));
    return nestedFiles.flat();
  }
  return [];
}

export async function filterFiles(files: any) {
  const allFiles = await Promise.all(files.map(fetchFilesRecursively));
  return allFiles.flat();
}
