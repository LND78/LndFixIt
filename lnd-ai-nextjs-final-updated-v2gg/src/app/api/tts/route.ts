import { NextResponse } from 'next/server';

// TTSMP3.com API (Free, no registration)
async function generateWithTTSMP3(text: string, voice: string) {
  try {
    const voiceCode = voice === 'female' ? 'en-us-x-sfg#female_2-local' : 'en-us-x-sfg#male_1-local';

    const response = await fetch('https://ttsmp3.com/makemp3_new.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://ttsmp3.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: new URLSearchParams({
        'msg': text,
        'lang': voiceCode,
        'source': 'ttsmp3'
      })
    });

    if (!response.ok) {
      throw new Error(`TTSMP3 API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.Error === 0 && data.URL) {
      return data.URL;
    } else {
      throw new Error('TTSMP3 generation failed');
    }
  } catch (error) {
    console.error('TTSMP3 generation failed:', error);
    throw error;
  }
}

// TTSMaker API (Free, no registration)
async function generateWithTTSMaker(text: string, voice: string, speed: number) {
  try {
    const voiceId = voice === 'female' ? 'en-US-AriaNeural' : 'en-US-GuyNeural';

    const response = await fetch('https://ttsmaker.com/api/v1/create-tts-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://ttsmaker.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        text: text,
        voice_id: voiceId,
        audio_format: 'mp3',
        paragraph_pause: 300,
        reading_speed: speed
      })
    });

    if (!response.ok) {
      throw new Error(`TTSMaker API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.result_url) {
      return data.result_url;
    } else {
      throw new Error('TTSMaker generation failed');
    }
  } catch (error) {
    console.error('TTSMaker generation failed:', error);
    throw error;
  }
}


export async function POST(request: Request) {
  try {
    // The 'language' variable is not used by the server-side TTS providers, so it's removed.
    const { text, voice, speed, provider } = await request.json();

    let audioUrl = '';

    try {
      switch (provider) {
        case 'elevenlabs':
          audioUrl = await generateWithTTSMP3(text, voice);
          break;
        case 'openai':
          audioUrl = await generateWithTTSMaker(text, voice, speed);
          break;
        default:
          // Fallback to TTSMaker if provider is not recognized or browser
          audioUrl = await generateWithTTSMaker(text, voice, speed);
      }
    } catch (error) {
        console.error(`Failed to generate speech with ${provider}, falling back...`, error);
        // Fallback to the other provider if the first one fails
        if (provider === 'elevenlabs') {
            try {
                audioUrl = await generateWithTTSMaker(text, voice, speed);
            } catch (fallbackError) {
                console.error('Fallback to TTSMaker also failed', fallbackError);
                throw new Error('All TTS providers failed');
            }
        } else {
            try {
                audioUrl = await generateWithTTSMP3(text, voice);
            } catch (fallbackError) {
                console.error('Fallback to TTSMP3 also failed', fallbackError);
                throw new Error('All TTS providers failed');
            }
        }
    }


    return NextResponse.json({ audioUrl });
  } catch (error: unknown) {
    console.error('Error generating speech:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
