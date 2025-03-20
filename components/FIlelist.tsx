"use client";

export default function FileList({ files }: { files: any[] }) {
  return (
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
  );
}
