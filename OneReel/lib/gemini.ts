// lib/gemini.ts
export async function analyzeImageWithGemini(imageBase64: string, prompt: string) {
  const apiKey = 'AIzaSyDS4n5_0UkauS_5SuIZVXU1B4VhKXSUpE8'; // Replace with your actual API key

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  const json = await response.json();
  console.log('Gemini response:', JSON.stringify(json, null, 2)); // Log full response

  const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  return reply || 'No response from Gemini.';
}
