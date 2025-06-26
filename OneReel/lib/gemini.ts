// lib/gemini.ts
export async function analyzeImageWithGemini(imageBase64: string, prompt: string) {
  const apiKey = 'AIzaSyDS4n5_0UkauS_5SuIZVXU1B4VhKXSUpE8'; // 🔐 OK for dev testing

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt, // user prompt from search bar
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64, // base64 image
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  const json = await response.json();
  const reply = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  return reply || 'No response from Gemini.';
}
