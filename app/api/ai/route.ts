import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { content } = await request.json();

  if (content.length > 10000) {
    return NextResponse.json({
      readme: `# Installation Steps\n\n1. Clone the repository\n2. Run \`npm install\`\n3. Start the app with \`npm start\``,
    });
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Generate a README.md for the following code:\n\n${content}`,
        max_tokens: 500,
      }),
    });

    console.log("API Response Status:", response.status); // Log status
    console.log("API Response Headers:", response.headers); // Log headers

    if (!response.ok) {
      const errorData = await response.json(); // Log error details
      console.error("API Error Data:", errorData);
      throw new Error(`Failed to call Mistral API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response Data:", data); // Log response data

    return NextResponse.json({ readme: data.choices[0].text });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate README. Please try again later." },
      { status: 500 }
    );
  }
}
