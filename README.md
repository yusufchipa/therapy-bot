# AI Therapy Chatbot

A Next.js application that provides an AI-powered therapy chatbot using Google's Gemini API.

## Features

- Modern chat interface built with Next.js and Tailwind CSS
- Integration with Google's Gemini 2.0 Flash model
- No login required - just start chatting
- Session-based conversations (chats reset on page refresh)
- Responsive design that works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- A Google Gemini API key

### Environment Setup

1. Create a `.env.local` file in the root directory
2. Add your Gemini API key to the file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Type your message in the input field and press Send
2. The AI will respond with supportive, therapy-focused messages
3. Refresh the page anytime to start a new conversation

## Security Note

This application uses environment variables to securely store API keys. Never commit your `.env.local` file to version control.

## License

This project is open source and available under the [MIT License](LICENSE).
