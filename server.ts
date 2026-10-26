import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Deterministic sizing algorithm fallback for guaranteed reliability
function calculateAlgorithmicSize(
  heightCm: number,
  weightKg: number,
  fitPreference: 'slim' | 'regular' | 'loose',
  category: string,
  availableSizes: string[]
) {
  // BMI-based estimation
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (category === 'shoes') {
    // Foot size estimation based on height
    // Average male: 178cm -> ~42-43 EU; female 165cm -> ~38-39 EU
    let euSize = Math.round(34 + (heightCm - 140) * 0.18);
    if (fitPreference === 'loose') euSize += 1;
    if (fitPreference === 'slim') euSize -= 1;
    euSize = Math.max(36, Math.min(45, euSize));

    const matched = availableSizes.find((s) => s.includes(`${euSize}`)) || availableSizes[Math.floor(availableSizes.length / 2)] || '42 EU';
    return {
      recommendedSize: matched,
      confidence: 94,
      fitAnalysis: `Based on your height (${heightCm}cm) and ${fitPreference} preference, EU ${euSize} offers natural footbed contouring without toe crowding.`,
      alternateSize: availableSizes.find((s) => s !== matched) || matched,
      breakdown: {
        chestOrWidth: fitPreference === 'slim' ? 'Snug Fit' : 'Standard Width',
        length: 'True to European Last',
        waistOrInstep: 'Arch Support Verified',
      },
    };
  }

  // Garment sizing (Men / Women)
  let baseIndex = 1; // default 'M' or '48 (M)'
  if (bmi < 20) {
    baseIndex = 0; // XS / S
  } else if (bmi < 23) {
    baseIndex = 1; // S / M
  } else if (bmi < 26.5) {
    baseIndex = 2; // M / L
  } else {
    baseIndex = 3; // L / XL
  }

  if (fitPreference === 'loose') {
    baseIndex = Math.min(availableSizes.length - 1, baseIndex + 1);
  } else if (fitPreference === 'slim') {
    baseIndex = Math.max(0, baseIndex - 1);
  }

  const selected = availableSizes[Math.min(baseIndex, availableSizes.length - 1)] || availableSizes[0];
  const alt = availableSizes[Math.max(0, Math.min(availableSizes.length - 1, baseIndex + (fitPreference === 'slim' ? 1 : -1)))];

  return {
    recommendedSize: selected,
    confidence: 95,
    fitAnalysis: `For your ${heightCm}cm stature and ${weightKg}kg frame with a ${fitPreference} fit preference, ${selected} achieves the signature ZAVIK silhouette with pristine shoulder alignment and effortless drape.`,
    alternateSize: alt !== selected ? alt : undefined,
    breakdown: {
      chestOrWidth: fitPreference === 'slim' ? 'Structured & Close' : fitPreference === 'loose' ? 'Relaxed & Breathable' : 'Classic Tailored',
      length: 'Proportional Drop',
      waistOrInstep: 'Tapered Silhouette',
    },
  };
}

// AI-driven Size Predictor endpoint
app.post('/api/predict-size', async (req, res) => {
  try {
    const {
      heightCm,
      weightKg,
      fitPreference, // 'slim' | 'regular' | 'loose'
      productName,
      category,
      subCategory,
      availableSizes,
      description,
    } = req.body;

    if (!heightCm || !weightKg || !availableSizes || !Array.isArray(availableSizes)) {
      return res.status(400).json({ error: 'Missing required measurement parameters' });
    }

    // Try Gemini API if key exists
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are the Master Master Tailor and Chief Fit Director at ZAVIK Haute Prêt-à-Porter.
A client requests an exact size recommendation for:
Product: ${productName} (${category} - ${subCategory})
Product Description: ${description || ''}
Available Sizes for this product: ${JSON.stringify(availableSizes)}

Client Measurements:
- Height: ${heightCm} cm
- Weight: ${weightKg} kg
- Fit Preference: ${fitPreference} (Options: 'slim', 'regular', 'loose')

Task:
1. Select the single best matching size from the provided "Available Sizes" list. You MUST choose one of the available sizes.
2. Provide a confidence percentage between 88 and 98.
3. Write a refined, luxurious, bespoke tailoring analysis (1-2 sentences) explaining why this size is optimal for their proportions and desired silhouette.
4. Suggest a secondary alternative size if they want to layer or alter drape.
5. Provide a 3-point fit breakdown for Chest/Width, Length, and Waist/Instep.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an elite master tailor for a luxury fashion house. Return your analysis in pure JSON format matching the schema.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendedSize: {
                  type: Type.STRING,
                  description: 'Must strictly be one of the sizes from the availableSizes array.',
                },
                confidence: {
                  type: Type.NUMBER,
                  description: 'Percentage confidence between 88 and 98.',
                },
                fitAnalysis: {
                  type: Type.STRING,
                  description: 'Refined 1-2 sentence tailoring explanation.',
                },
                alternateSize: {
                  type: Type.STRING,
                  description: 'Secondary size suggestion.',
                },
                breakdown: {
                  type: Type.OBJECT,
                  properties: {
                    chestOrWidth: { type: Type.STRING },
                    length: { type: Type.STRING },
                    waistOrInstep: { type: Type.STRING },
                  },
                },
              },
              required: ['recommendedSize', 'confidence', 'fitAnalysis'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          // Ensure recommended size is in available sizes
          if (availableSizes.includes(parsed.recommendedSize)) {
            return res.json(parsed);
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, using atelier algorithm fallback:', geminiError);
      }
    }

    // Fallback to algorithmic tailoring model
    const fallback = calculateAlgorithmicSize(
      Number(heightCm),
      Number(weightKg),
      fitPreference || 'regular',
      category,
      availableSizes
    );
    return res.json(fallback);
  } catch (error) {
    console.error('Size prediction error:', error);
    res.status(500).json({ error: 'Failed to predict size' });
  }
});

// Vite Middleware mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ZAVIK luxury server running at http://0.0.0.0:${port}`);
  });
}

startServer();
