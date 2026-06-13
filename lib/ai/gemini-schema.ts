import { SchemaType, type ResponseSchema } from "@google/generative-ai";

export const BINARY_SEARCH_GEMINI_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    topic: { type: SchemaType.STRING },
    category: { type: SchemaType.STRING },
    templateId: { type: SchemaType.STRING },
    confidence: { type: SchemaType.NUMBER },
    explanation: {
      type: SchemaType.OBJECT,
      properties: {
        hook: { type: SchemaType.STRING },
        keyIdeas: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        analogy: { type: SchemaType.STRING },
      },
    },
    simulation: {
      type: SchemaType.OBJECT,
      properties: {
        config: {
          type: SchemaType.OBJECT,
          properties: {
            sortedArray: { type: SchemaType.ARRAY, items: { type: SchemaType.INTEGER } },
            target: { type: SchemaType.INTEGER },
            steps: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  low: { type: SchemaType.INTEGER },
                  high: { type: SchemaType.INTEGER },
                  mid: { type: SchemaType.INTEGER },
                  midValue: { type: SchemaType.INTEGER },
                  comparison: { type: SchemaType.STRING },
                  eliminated: { type: SchemaType.STRING },
                },
                required: ["low", "high", "mid", "comparison"],
              },
            },
          },
          required: ["sortedArray", "target", "steps"],
        },
      },
      required: ["config"],
    },
    quiz: {
      type: SchemaType.OBJECT,
      properties: {
        questions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              question: { type: SchemaType.STRING },
              options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              correctIndex: { type: SchemaType.INTEGER },
              explanation: { type: SchemaType.STRING },
            },
            required: ["id", "question", "options", "correctIndex"],
          },
        },
      },
      required: ["questions"],
    },
  },
  required: ["topic", "category", "templateId", "confidence", "simulation", "quiz"],
};

export const DNS_RESOLUTION_GEMINI_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    topic: { type: SchemaType.STRING },
    category: { type: SchemaType.STRING },
    templateId: { type: SchemaType.STRING },
    confidence: { type: SchemaType.NUMBER },
    explanation: {
      type: SchemaType.OBJECT,
      properties: {
        hook: { type: SchemaType.STRING },
        keyIdeas: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        analogy: { type: SchemaType.STRING },
      },
    },
    simulation: {
      type: SchemaType.OBJECT,
      properties: {
        config: {
          type: SchemaType.OBJECT,
          properties: {
            domain: { type: SchemaType.STRING },
            resolvedIp: { type: SchemaType.STRING },
            steps: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  stepNumber: { type: SchemaType.INTEGER },
                  from: { type: SchemaType.STRING },
                  to: { type: SchemaType.STRING },
                  query: { type: SchemaType.STRING },
                  response: { type: SchemaType.STRING },
                  type: { type: SchemaType.STRING },
                },
                required: ["stepNumber", "from", "to", "query", "response", "type"],
              },
            },
          },
          required: ["domain", "resolvedIp", "steps"],
        },
      },
      required: ["config"],
    },
    quiz: {
      type: SchemaType.OBJECT,
      properties: {
        questions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              question: { type: SchemaType.STRING },
              options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              correctIndex: { type: SchemaType.INTEGER },
              explanation: { type: SchemaType.STRING },
            },
            required: ["id", "question", "options", "correctIndex"],
          },
        },
      },
      required: ["questions"],
    },
  },
  required: ["topic", "category", "templateId", "confidence", "simulation", "quiz"],
};

export const PROJECTILE_MOTION_GEMINI_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    topic: { type: SchemaType.STRING },
    category: { type: SchemaType.STRING },
    templateId: { type: SchemaType.STRING },
    confidence: { type: SchemaType.NUMBER },
    explanation: {
      type: SchemaType.OBJECT,
      properties: {
        hook: { type: SchemaType.STRING },
        keyIdeas: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        analogy: { type: SchemaType.STRING },
      },
    },
    simulation: {
      type: SchemaType.OBJECT,
      properties: {
        config: {
          type: SchemaType.OBJECT,
          properties: {
            velocity: { type: SchemaType.NUMBER },
            angle: { type: SchemaType.NUMBER },
            gravity: { type: SchemaType.NUMBER },
            scenarios: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  label: { type: SchemaType.STRING },
                  velocity: { type: SchemaType.NUMBER },
                  angle: { type: SchemaType.NUMBER },
                },
              },
            },
          },
          required: ["velocity", "angle", "gravity", "scenarios"],
        },
      },
      required: ["config"],
    },
    quiz: {
      type: SchemaType.OBJECT,
      properties: {
        questions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              question: { type: SchemaType.STRING },
              options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              correctIndex: { type: SchemaType.INTEGER },
              explanation: { type: SchemaType.STRING },
            },
            required: ["id", "question", "options", "correctIndex"],
          },
        },
      },
      required: ["questions"],
    },
  },
  required: ["topic", "category", "templateId", "confidence", "simulation", "quiz"],
};

export const AI_LESSON_GEMINI_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    topic: { type: SchemaType.STRING },
    category: { type: SchemaType.STRING },
    templateId: { type: SchemaType.STRING },
    confidence: { type: SchemaType.NUMBER },
    title: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },
    explanation: {
      type: SchemaType.OBJECT,
      properties: {
        hook: { type: SchemaType.STRING },
        keyIdeas: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        analogy: { type: SchemaType.STRING },
      },
    },
    keyConcepts: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          detail: { type: SchemaType.STRING },
        },
      },
    },
    visualCards: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          caption: { type: SchemaType.STRING },
          image: { type: SchemaType.STRING },
        },
      },
    },
    quiz: {
      type: SchemaType.OBJECT,
      properties: {
        questions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              question: { type: SchemaType.STRING },
              options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              correctIndex: { type: SchemaType.INTEGER },
              explanation: { type: SchemaType.STRING },
            },
          },
        },
      },
    },
    insights: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          text: { type: SchemaType.STRING },
        },
      },
    },
  },
  required: ["topic", "category", "templateId", "title", "summary"],
};
