import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'bot' | 'assistant' | 'model';
  content: string;
}

const GEMINI_API_KEY = 'AIzaSyC1AGmqb60CGMLK8QqH9phziNS24HuK-5Y';
const DEEPSEEK_API_KEY = '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';

async function getPollinationsResponse(message: string, history: ChatMessage[]) {
  const context = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  const fullPrompt = context + '\nuser: ' + message;
  const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`);
  if (!response.ok) {
    console.error("Pollinations API error:", await response.text());
    throw new Error('Pollinations API error');
  }
  return await response.text();
}

async function getGeminiResponse(message: string, history: ChatMessage[]) {
  const historyText = history.map(msg => `${msg.role === 'bot' ? 'Assistant' : 'User'}: ${msg.content}`).join('\n');
  const contextPrompt = `Previous conversation for context:\n${historyText}\n\nCurrent prompt to respond to: ${message}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{ parts: [{ text: contextPrompt }] }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Gemini API error:", response.status, errorData);
    throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();

  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
  } else if (data.candidates && data.candidates[0] && data.candidates[0].finishReason === 'SAFETY') {
      throw new Error('Content was blocked by safety filters.');
  } else {
      console.error('Unexpected Gemini response format:', data);
      throw new Error('Invalid response format from Gemini API');
  }
}

async function getDeepSeekResponse(message: string, history: ChatMessage[]) {
    const historyText = history.map(msg => `${msg.role === 'bot' ? 'Assistant' : 'User'}: ${msg.content}`).join('\n');
    const contextPrompt = `Previous conversation for context:\n${historyText}\n\nCurrent prompt to respond to: ${message}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'HTTP-Referer': 'https://lndaihub.netlify.app/',
            'X-Title': 'LND Multi-Tool Suite'
        },
        body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: [{ role: 'user', content: contextPrompt }]
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("DeepSeek API error:", response.status, errorData);
        throw new Error(`DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
    } else {
        console.error('Unexpected DeepSeek response format:', data);
        throw new Error('Invalid response format from DeepSeek API');
    }
}


export async function POST(request: Request) {
  try {
    const { message, model, history } = await request.json();
    let reply = '';

    switch (model) {
      case 'gemini':
        reply = await getGeminiResponse(message, history);
        break;
      case 'deepseek':
        reply = await getDeepSeekResponse(message, history);
        break;
      case 'pollinations':
      default:
        reply = await getPollinationsResponse(message, history);
        break;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
