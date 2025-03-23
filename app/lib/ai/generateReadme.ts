// app/lib/ai/generateReadme.ts
export async function generateReadme(content: string) {
  if (content.trim().length === 0) {
    return `# Project Name\n\nA professional software project. Add code files to generate a detailed README!`;
  }

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await response.json();
    return data.readme;
  } catch (error) {
    console.error("Failed to generate README:", error);
    return `# Installation Steps\n\n1. Clone the repository\n2. Run \`npm install\`\n3. Start the app with \`npm start\``;
  }
}
