import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('URL parameter is required', { status: 400 });
  }

  // A simple whitelist to prevent misuse of this endpoint
  const allowedDomains = [
    'api.qrserver.com',
    'image.pollinations.ai',
    'source.unsplash.com',
    'images.unsplash.com',
    'lh3.googleusercontent.com',
    'ttsmp3.com',
    'ttsmaker.com',
  ];

  const domain = new URL(url).hostname;
  if (!allowedDomains.some(d => domain.endsWith(d))) {
      return new NextResponse('Provided URL is not allowed', { status: 403 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const filename = url.substring(url.lastIndexOf('/') + 1) || 'download';

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new Response(imageBuffer, { headers });

  } catch (error) {
    console.error('Download proxy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
