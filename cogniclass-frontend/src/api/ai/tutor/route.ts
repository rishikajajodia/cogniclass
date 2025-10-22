import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, context = 'general' } = await request.json();

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are an AI tutor specializing in collaborative learning. 
            You help students understand concepts through clear explanations, examples, and hints.
            Context: ${context}
            
            Guidelines:
            - Be encouraging and patient
            - Break down complex topics
            - Provide practical examples
            - Ask guiding questions to promote thinking
            - Adapt to the student's level
            - Keep responses under 300 words`
          },
          {
            role: 'user',
            content: message
          }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      })
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    
    // Determine response type based on content
    let type: 'explanation' | 'hint' | 'example' | 'question' = 'explanation';
    const content = data.choices[0].message.content.toLowerCase();
    
    if (content.includes('example') || content.includes('for instance')) {
      type = 'example';
    } else if (content.includes('hint') || content.includes('try thinking')) {
      type = 'hint';
    } else if (content.includes('?') && content.split('?').length > 2) {
      type = 'question';
    }

    return NextResponse.json({
      response: data.choices[0].message.content,
      type: type,
      tokens: data.usage.total_tokens
    });

  } catch (error) {
    console.error('AI Tutor error:', error);
    return NextResponse.json(
      { 
        response: "I'm having trouble connecting right now. Please try again in a moment.",
        type: 'explanation',
        error: true
      },
      { status: 500 }
    );
  }
}
