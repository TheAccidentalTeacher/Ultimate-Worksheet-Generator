import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Call OpenAI API (replace with your real OpenAI call)
    // For demo: just echo the prompt back with a fake worksheet
    const worksheet = {
      title: "Sample Worksheet",
      prompt,
      content: [
        { type: "fill-in", question: "The capital of France is ____.", answer: "Paris" },
        { type: "short-answer", question: "Explain photosynthesis.", answer: "Plants use sunlight..." }
      ]
    };

    // In real use, you'd fetch from OpenAI here and return the result!
    return NextResponse.json(worksheet);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate worksheet.' }, { status: 500 });
  }
}
