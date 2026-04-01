interface QuiverGenerateOptions {
  prompt: string;
  n?: number;
  temperature?: number;
}

interface QuiverResponse {
  data: Array<{
    svg: string;
  }>;
}

export async function generateSvg(options: QuiverGenerateOptions): Promise<string | null> {
  const apiKey = process.env.QUIVER_AI_API_KEY;
  if (!apiKey) {
    console.error("QUIVER_AI_API_KEY is not set");
    return null;
  }

  try {
    const response = await fetch("https://api.quiver.ai/v1/svgs/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: options.prompt,
        n: options.n ?? 1,
        temperature: options.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      console.error(`Quiver API error: ${response.status}`);
      return null;
    }

    const data: QuiverResponse = await response.json();
    return data.data?.[0]?.svg ?? null;
  } catch (error) {
    console.error("Quiver generation error:", error);
    return null;
  }
}

export const CATEGORY_SVG_PROMPTS: Record<string, string> = {
  restaurant: "Minimal flat vector illustration of a traditional Korean hanok restaurant with warm tones, steaming food on a wooden table, warm orange and brown color palette, clean lines, no text",
  cafe: "Minimal flat vector illustration of a cozy Korean hanok cafe with coffee cups and desserts, warm orange and cream palette, clean geometric style, no text",
  culture: "Minimal flat vector illustration of a traditional Korean cultural space with art displays and hanok architecture, warm earth tones, clean lines, no text",
  course: "Minimal flat vector illustration of a walking route map through Korean hanok village alleyways, warm orange markers and dotted path, clean style, no text",
  event: "Minimal flat vector illustration of a festive Korean street market with lanterns and hanok buildings, warm vibrant colors, clean geometric style, no text",
  locker_tip: "Minimal flat vector illustration of a cute dog mascot next to a storage locker, warm orange and cream palette, friendly cartoon style, no text",
  story: "Minimal flat vector illustration of traditional Korean hanok rooftops with a nostalgic sunset, warm sepia and orange tones, clean lines, no text",
};
