import { NextResponse } from 'next/server';

// Enhanced TTSMP3.com API (Free, no registration)
async function generateWithTTSMP3(text: string, voice: string, language: string = 'en-us') {
  try {
    const voiceMapping: { [key: string]: string } = {
      'female': `${language}-x-sfg#female_2-local`,
      'male': `${language}-x-sfg#male_1-local`
    };
    
    const voiceCode = voiceMapping[voice] || voiceMapping['female'];

    const response = await fetch('https://ttsmp3.com/makemp3_new.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://ttsmp3.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://ttsmp3.com'
      },
      body: new URLSearchParams({
        'msg': text.substring(0, 3000), // Limit text length
        'lang': voiceCode,
        'source': 'ttsmp3'
      })
    });

    if (!response.ok) {
      throw new Error(`TTSMP3 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.Error === 0 && data.URL) {
      return data.URL;
    } else {
      throw new Error(`TTSMP3 generation failed: ${data.Text || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('TTSMP3 generation failed:', error);
    throw error;
  }
}

// Enhanced TTSMaker API (Free, no registration)
async function generateWithTTSMaker(text: string, voice: string, speed: number, language: string = 'en-US') {
  try {
    const voiceMapping: { [key: string]: string } = {
      'en-US-female': 'en-US-AriaNeural',
      'en-US-male': 'en-US-GuyNeural',
      'en-GB-female': 'en-GB-SoniaNeural',
      'en-GB-male': 'en-GB-RyanNeural',
      'female': 'en-US-AriaNeural',
      'male': 'en-US-GuyNeural'
    };
    
    const voiceId = voiceMapping[`${language}-${voice}`] || voiceMapping[voice] || voiceMapping['female'];

    const response = await fetch('https://ttsmaker.com/api/v1/create-tts-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://ttsmaker.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://ttsmaker.com'
      },
      body: JSON.stringify({
        text: text.substring(0, 5000), // Limit text length
        voice_id: voiceId,
        audio_format: 'mp3',
        paragraph_pause: 300,
        reading_speed: Math.max(0.5, Math.min(2.0, speed)) // Ensure speed is within valid range
      })
    });

    if (!response.ok) {
      throw new Error(`TTSMaker API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success && data.result_url) {
      return data.result_url;
    } else {
      throw new Error(`TTSMaker generation failed: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('TTSMaker generation failed:', error);
    throw error;
  }
}

// New Provider: VoiceRSS (Alternative free provider)
async function generateWithVoiceRSS(text: string, voice: string, language: string = 'en-us') {
  try {
    const voiceMapping: { [key: string]: string } = {
      'female': 'Linda',
      'male': 'Mike'
    };
    
    const voiceName = voiceMapping[voice] || 'Linda';
    
    // Note: VoiceRSS requires an API key for production use
    // This is a fallback implementation using a demo endpoint
    const params = new URLSearchParams({
      key: 'demo', // In production, use a real API key
      hl: language,
      v: voiceName,
      r: '0', // Audio Rate: -10 to 10
      c: 'mp3', // Audio Codec
      f: '44khz_16bit_stereo', // Audio Format
      src: text.substring(0, 2000)
    });

    const audioUrl = `http://api.voicerss.org/?${params.toString()}`;
    
    // Test if the URL is accessible
    const testResponse = await fetch(audioUrl, { method: 'HEAD' });
    if (testResponse.ok) {
      return audioUrl;
    } else {
      throw new Error('VoiceRSS service unavailable');
    }
  } catch (error) {
    console.error('VoiceRSS generation failed:', error);
    throw error;
  }
}

// New Provider: ResponsiveVoice (Fallback)
async function generateWithResponsiveVoice(text: string, voice: string) {
  try {
    const voiceMapping: { [key: string]: string } = {
      'female': 'US English Female',
      'male': 'US English Male'
    };
    
    const rvVoice = voiceMapping[voice] || 'US English Female';
    
    // ResponsiveVoice API endpoint (requires API key for commercial use)
    const params = new URLSearchParams({
      t: text.substring(0, 1000),
      tl: rvVoice,
      sv: '', // Speed/Volume parameters
      vn: '', // Voice name
      pitch: '1',
      rate: '1',
      vol: '1'
    });

    // This is a simplified implementation - in production you'd need proper API integration
    const audioUrl = `https://responsivevoice.com/responsivevoice/getvoice.php?${params.toString()}`;
    
    return audioUrl;
  } catch (error) {
    console.error('ResponsiveVoice generation failed:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { text, voice = 'female', speed = 1.0, language = 'en-US', provider = 'auto' } = await request.json();

    // Input validation
    if (!text || typeof text !== 'string') {
      return new NextResponse(JSON.stringify({ error: 'Text is required and must be a string' }), { status: 400 });
    }

    if (text.length > 10000) {
      return new NextResponse(JSON.stringify({ error: 'Text is too long. Maximum 10,000 characters allowed.' }), { status: 400 });
    }

    const sanitizedText = text.trim();
    if (sanitizedText.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Text cannot be empty' }), { status: 400 });
    }

    // Provider priority order for better reliability
    const providers = [
      { name: 'ttsmaker', func: () => generateWithTTSMaker(sanitizedText, voice, speed, language) },
      { name: 'ttsmp3', func: () => generateWithTTSMP3(sanitizedText, voice, language.toLowerCase().replace('-', '-')) },
      { name: 'voicerss', func: () => generateWithVoiceRSS(sanitizedText, voice, language.toLowerCase().replace('-', '-')) }
    ];

    let lastError: Error | null = null;
    let audioUrl = '';

    // Try providers in order until one succeeds
    for (const providerConfig of providers) {
      try {
        console.log(`Trying provider: ${providerConfig.name}`);
        audioUrl = await providerConfig.func();
        
        if (audioUrl) {
          console.log(`Successfully generated audio with ${providerConfig.name}`);
          break;
        }
      } catch (error) {
        console.error(`Provider ${providerConfig.name} failed:`, error);
        lastError = error instanceof Error ? error : new Error(`Unknown error with ${providerConfig.name}`);
        continue;
      }
    }

    if (!audioUrl) {
      const errorMessage = lastError ? lastError.message : 'All TTS providers failed';
      console.error('All TTS providers failed:', errorMessage);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Speech generation failed. Please try again later.',
          details: errorMessage 
        }), 
        { status: 503 }
      );
    }

    // Validate the audio URL
    try {
      const testResponse = await fetch(audioUrl, { method: 'HEAD' });
      if (!testResponse.ok) {
        throw new Error('Generated audio URL is not accessible');
      }
    } catch (urlError) {
      console.error('Audio URL validation failed:', urlError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Generated audio is not accessible. Please try again.',
          details: 'Audio validation failed' 
        }), 
        { status: 503 }
      );
    }

    return NextResponse.json({ 
      audioUrl,
      message: 'Speech generated successfully',
      metadata: {
        textLength: sanitizedText.length,
        voice,
        speed,
        language
      }
    });

  } catch (error: unknown) {
    console.error('Error generating speech:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        details: errorMessage 
      }), 
      { status: 500 }
    );
  }
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'TTS API is operational',
    providers: ['ttsmaker', 'ttsmp3', 'voicerss'],
    supportedVoices: ['male', 'female'],
    supportedLanguages: ['en-US', 'en-GB'],
    maxTextLength: 10000
  });
}
