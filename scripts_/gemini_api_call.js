import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const MODEL = 'gemini-2.0-flash-001'; 

function extractText(resp) {
  
  try {
 
    if (resp?.response?.text) return resp.response.text();

    const partsA = resp?.response?.candidates?.[0]?.content?.parts;
    if (Array.isArray(partsA)) return partsA.map(p => p?.text || '').join('');

   
    const partsB = resp?.candidates?.[0]?.content?.parts;
    if (Array.isArray(partsB)) return partsB.map(p => p?.text || '').join('');

    return typeof resp === 'string' ? resp : JSON.stringify(resp);
  } catch {
    return typeof resp === 'string' ? resp : JSON.stringify(resp);
  }
}

export async function gemini_api_call(userQuery) {
  try {
    const resp = await ai.models.generateContent({
      model: MODEL,
      contents: userQuery
    });
    const text = extractText(resp);
    return { text };
  } catch (err) {
    console.error('Gemini API Error:', err);
    return { error: err?.message || 'Failed to get response from Gemini API.' };
  }
}
