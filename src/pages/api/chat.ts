import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.error('GEMINI_API_KEY is not defined in environment variables');
}
const genAI = new GoogleGenerativeAI(apiKey);

// Create a therapy chatbot model with specific instructions
const therapistInstructions = `
You are a compassionate and supportive AI therapist. Your role is to:
- Listen attentively to the user's concerns
- Respond with empathy and understanding
- Provide helpful insights and coping strategies
- Ask thoughtful questions to help users explore their feelings
- Suggest practical exercises or techniques when appropriate
- Maintain a warm, non-judgmental tone
- Never claim to be a human or licensed professional
- Clarify that you're an AI assistant providing support, not medical advice
- Encourage seeking professional help for serious mental health concerns

Your responses should be supportive, thoughtful, and focused on the user's wellbeing.
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    // Start a chat session with the therapist instructions
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Hello, I could use someone to talk to.' }],
        },
        {
          role: 'model',
          parts: [{ text: "I'm here to listen and support you. What's on your mind today?" }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      systemInstruction: { role: 'system', parts: [{ text: therapistInstructions }] },
    });

    // Send the user's message and get a response
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: 'Failed to process your message' });
  }
}