export async function generateReadme(content: string) {
  if (content.length > 10000) {
    return `# Installation Steps\n\n1. Clone the repository\n2. Run \`npm install\`\n3. Start the app with \`npm start\``;
  }

  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  const data = await response.json();
  return data.readme;
}
