export type ParsedMemory = {
  title: string;

  context: string;

  type:
    | "PERSON"
    | "LOCATION"
    | "PROJECT"
    | "TIME"
    | "CUSTOM";

  trigger: string;

  priority:
    | "LOW"
    | "NORMAL"
    | "HIGH";

  locationIntent: boolean;

  placeName: string | null;

  confidence: number;
};


type OllamaResponse = {
  message?: {
    content?: string;
  };
};


export async function parseMemoryWithAI(
  text: string
): Promise<ParsedMemory> {

  const ollamaUrl =
    process.env.OLLAMA_URL ||
    "http://127.0.0.1:11434";

  const model =
    process.env.OLLAMA_MODEL ||
    "qwen3:4b-instruct";


  const prompt = `
You are the AI parser for an application called Context Memory.

Convert the user's natural-language reminder into JSON.

Return ONLY valid JSON.

Required format:

{
  "title": "string",
  "context": "string",
  "type": "PERSON | LOCATION | PROJECT | TIME | CUSTOM",
  "trigger": "string",
  "priority": "LOW | NORMAL | HIGH",
  "locationIntent": true,
  "placeName": "string or null",
  "confidence": 0.95
}

Rules:

PERSON:
Relevant when interacting with a person.

LOCATION:
Relevant when arriving at or being near a place.

PROJECT:
Relevant to a work project.

TIME:
Relevant to a particular time, date, or day.

CUSTOM:
Use when the other categories do not clearly apply.

Do not invent people, places, projects, or dates.

Priority should normally be NORMAL.

locationIntent must only be true when location is relevant.

placeName must be null when no location is mentioned.

confidence must be between 0 and 1.

User memory:

${text}
  `.trim();


  const response =
    await fetch(
      `${ollamaUrl}/api/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model,

          stream: false,

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          format: "json",
        }),
      }
    );


  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Ollama request failed: ${errorText}`
    );
  }


  const data =
    await response.json() as
      OllamaResponse;


  const content =
    data.message?.content;


  if (!content) {
    throw new Error(
      "Ollama returned an empty response"
    );
  }


  let parsed: ParsedMemory;

  try {
    parsed =
      JSON.parse(
        content
      ) as ParsedMemory;
  } catch {
    console.error(
      "Ollama output:",
      content
    );

    throw new Error(
      "Unable to parse Ollama response"
    );
  }


  validateParsedMemory(
    parsed
  );


  return parsed;
}


function validateParsedMemory(
  memory: ParsedMemory
) {
  const validTypes = [
    "PERSON",
    "LOCATION",
    "PROJECT",
    "TIME",
    "CUSTOM",
  ];

  const validPriorities = [
    "LOW",
    "NORMAL",
    "HIGH",
  ];


  if (
    !memory.title ||
    !memory.context ||
    !memory.trigger
  ) {
    throw new Error(
      "AI response is missing required fields"
    );
  }


  if (
    !validTypes.includes(
      memory.type
    )
  ) {
    throw new Error(
      "AI returned an invalid memory type"
    );
  }


  if (
    !validPriorities.includes(
      memory.priority
    )
  ) {
    throw new Error(
      "AI returned an invalid priority"
    );
  }


  if (
    typeof memory.locationIntent !==
    "boolean"
  ) {
    throw new Error(
      "AI returned invalid locationIntent"
    );
  }


  if (
    typeof memory.confidence !==
      "number" ||
    memory.confidence < 0 ||
    memory.confidence > 1
  ) {
    throw new Error(
      "AI returned invalid confidence"
    );
  }
}