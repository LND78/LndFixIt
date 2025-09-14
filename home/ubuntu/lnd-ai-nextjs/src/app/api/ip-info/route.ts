import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let ip = searchParams.get('ip');

  // If no IP is provided in the query, try to get the user's IP from headers
  if (!ip) {
    const headersList = await headers();
    const xForwardedFor = headersList.get('x-forwarded-for');
    if (xForwardedFor) {
      ip = xForwardedFor.split(',')[0];
    } else {
      // This might be the IP of the server environment, not the end-user,
      // but it's a fallback. ipapi.co will return the caller's IP if the path is empty.
      ip = '';
    }
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.reason || 'Failed to fetch IP information');
    }
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('IP Info API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
