import { NextResponse } from 'next/server';

async function generateSingleImage(prompt: string, apiProvider: string, index: number) {
    const providers = [
        'pollinations', 'deepai', 'huggingface', 'modelslab', 'replicate',
        'perchance', 'raphaelai', 'venice', 'nastia', 'vadoo', 'flux',
        'stablediffusion', 'aiscribble', 'nsfwai', 'dynapictures', 'gemini',
        'sexyai', 'pornpen', 'soulgen', 'dreamgf', 'icegirls'
    ];

    const selectedProvider = apiProvider === 'random'
        ? providers[Math.floor(Math.random() * providers.length)]
        : apiProvider;

    const maxRetries = 4;
    let lastError: Error | null = null;

    for (let retry = 0; retry < maxRetries; retry++) {
        try {
            let imageUrl;
            const seed = Date.now() + index + retry;

            if (selectedProvider === 'pollinations' || retry === 0) {
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${seed}`;
            } else if (retry === 1) {
                imageUrl = `https://api.deepai.org/api/text2img?text=${encodeURIComponent(prompt)}&grid_size=1&width=512&height=512&seed=${seed}`;
            } else if (retry === 2) {
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=1024&height=1024&nologo=true&model=turbo`;
            } else {
                imageUrl = `https://source.unsplash.com/512x512/?${encodeURIComponent(prompt.split(' ').slice(0, 3).join(','))}&sig=${seed}`;
            }

            const response = await fetch(imageUrl);
            if (!response.ok || !response.headers.get('content-type')?.startsWith('image')) {
                throw new Error(`Failed to fetch image from ${selectedProvider} or content-type is not image`);
            }

            return {
                url: imageUrl,
                prompt: prompt,
                provider: selectedProvider,
            };

        } catch (error: unknown) {
            if (error instanceof Error) {
                lastError = error;
            } else {
                lastError = new Error('An unknown error occurred during image generation retry.');
            }
            console.warn(`Attempt ${retry + 1} failed for image ${index + 1}:`, error);
            if (retry < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
            }
        }
    }

    console.error(`Failed to generate image ${index + 1} after ${maxRetries} attempts:`, lastError);
    return null;
}


export async function POST(request: Request) {
  try {
    const { prompt, style, quality, apiProvider } = await request.json();

    const enhancedPrompt = `${prompt}${style ? `, ${style} style` : ''}${quality ? `, ${quality} quality` : ''}`;

    const image = await generateSingleImage(enhancedPrompt, apiProvider, 0);

    if (!image) {
        return new NextResponse(JSON.stringify({ error: 'Failed to generate image after multiple retries.' }), { status: 500 });
    }

    return NextResponse.json({ image });
  } catch (error: unknown) {
    console.error('Error generating image:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: errorMessage }),{ status: 500 });
  }
}
