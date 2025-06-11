import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "npm:openai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Starting transcription and formatting...");
    
    // Parse JSON body instead of FormData
    const body = await req.json();
    const base64Audio = body.audio;
    
    if (!base64Audio) {
      return new Response(JSON.stringify({ error: 'No audio data provided' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Base64 audio data received, length:", base64Audio.length);

    // Convert base64 to Uint8Array
    const audioBytes = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
    
    // Create a File object from the audio bytes
    const audioFile = new File([audioBytes], "recording.wav", { type: "audio/wav" });

    console.log("Audio file created:", audioFile.name, audioFile.size);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Step 1: Transcribe audio using Whisper
    console.log("Starting transcription...");
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    const rawTranscription = transcription.text;
    console.log("Raw transcription:", rawTranscription);

    if (!rawTranscription || rawTranscription.trim() === "") {
      return new Response(JSON.stringify({ 
        title: "Empty Note", 
        content: "No speech detected or empty note" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Step 2: Format transcription using GPT-4.1-nano with JSON mode
    console.log("Starting formatting...");
    const formattingPrompt = `You are an elite intelligence scribe, like one who follows Churchill everywhere and writes his speeches, meeting notes, and essays. Transform this voice note transcription into a beautifully crafted, essay-style note with intelligent organization.

Return a JSON object with exactly this structure:
{
  "title": "A compelling, content-rich title that captures the essence",
  "content": "The formatted content in Markdown"
}

Your mission as an intelligent scribe:

1. **INTELLIGENT HEADERS**: Create section headers that ARE the content, not generic labels
   - ❌ Bad: "## Overview", "## Key Points", "## Actions"  
   - ✅ Good: "## The morning routine that changed everything", "## Why most productivity advice fails us", "## Three conversations that shifted my perspective"
   - Headers should be scannable story beats - someone reading just the headers gets the narrative
   - Include specific details, numbers, names, or key insights in headers

2. **ESSAY-STYLE FLOW**: Organize content like a thoughtful essay or journal entry
   - Create natural narrative progression between sections
   - Group related ideas into coherent, digestible paragraphs (2-4 sentences each)
   - Use smooth transitions to connect thoughts
   - Respect the author's original meaning and voice completely

3. **CONTENT-RICH STRUCTURE**:
   - Lead with the most important insight in each section
   - Break long monologues into meaningful chunks based on topic shifts
   - Use **bold** for key concepts, discoveries, and important names/terms
   - Use *italics* for personal reflections, emphasis, and inner thoughts
   - Create bullet points only for actual lists (not to break up paragraphs)

4. **INTELLIGENT REORGANIZATION**:
   - Reorganize for logical flow while preserving ALL original meaning
   - Move scattered related points together into coherent sections
   - Create clear narrative or thematic progression
   - Combine fragmented thoughts into complete ideas

5. **POLISHED LANGUAGE**:
   - Remove filler words ("um", "uh", "you know", repetitive phrases)
   - Fix grammatical errors and clarify unclear phrasing
   - Enhance readability while maintaining the author's authentic voice
   - Keep the personal, conversational tone intact

6. **TITLE CRAFTSMANSHIP**:
   - Create a title that captures the main insight, story, or discovery
   - Should intrigue and inform (avoid generic titles)
   - Often the most interesting quote, realization, or central theme

**Example Transformation:**
Raw: "So I was thinking about, um, productivity and I realized that like, most advice doesn't work because, you know, everyone has different brains and I tried this new thing..."

Formatted:
Title: "Why One-Size-Fits-All Productivity Advice Never Worked for Me"
Content:
## The productivity advice industrial complex fails different brains

I've been reflecting on why most productivity advice feels hollow and ineffective. The fundamental flaw is assuming everyone's brain works the same way...

## My experiment with [specific method] - unexpected results

I decided to try [specific approach] and discovered something surprising...

Raw Transcription: "${rawTranscription}"`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: formattingPrompt }],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const rawOutput = chatCompletion.choices[0].message.content;
    console.log("Raw AI output:", rawOutput);

    let parsedOutput;
    try {
      parsedOutput = JSON.parse(rawOutput);
      
      // Validate required fields
      if (!parsedOutput.title || !parsedOutput.content) {
        throw new Error('Missing required fields in AI response');
      }
    } catch (e) {
      console.error("Failed to parse AI output as JSON:", e);
      // Fallback: create structured response
      parsedOutput = {
        title: rawTranscription.slice(0, 50) + (rawTranscription.length > 50 ? '...' : ''),
        content: rawTranscription
      };
    }

    console.log("Parsed output:", parsedOutput);

    return new Response(JSON.stringify(parsedOutput), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in transcribe-and-format function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process audio',
      details: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});