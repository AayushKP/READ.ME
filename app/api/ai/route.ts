import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    console.log("📩 Content received:", content.length, "characters");

    if (!content || content.length > 1000000) {
      console.warn("⚠️ Content too large or empty. Returning fallback README.");
      return NextResponse.json({
        readme: `# Installation Steps\n\n1. Clone the repository\n2. Run \`npm install\`\n3. Start the app with \`npm start\`\n\nThis project requires Node.js and npm to run.`,
      });
    }

    // Structured prompt for high-quality README generation
    const prompt = `
      You are an expert technical writer. Generate a well-structured README.md for a software project using the provided code.
      
      **Sections to include:**
      - 📌 **Project Title**: A meaningful name
      - 📝 **Description**: What this project does and its purpose
      - 🛠 **Installation**: Steps to install dependencies and set up the project
      - 🚀 **Usage**: Instructions on how to run and use the project
      - 🌟 **Features**: List key functionalities
      - 🤝 **Contributing**: How others can contribute
      - ⚖️ **License**: Include MIT license if applicable

      **Tech Stack Identified:** Express.js, EJS templates, Mongoose (MongoDB)
      
      **Code Files Extracted:**\n\n${content}
    `;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-tiny",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API Response Received");

    return NextResponse.json({
      readme:
        data.choices?.[0]?.message?.content || "README generation failed.",
    });
  } catch (error) {
    console.error("🔥 API Error:", error);
    return NextResponse.json({ readme: "Failed to generate README." });
  }
}
