import { useState, useRef, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Message = {
  role: 'user' | 'assistant';
  content: string;
  id?: string; // Add ID for animation keys
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hello, I'm Neura, your AI Therapist. How are you feeling today?",
    id: 'welcome-message'
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat with unique ID
    const userMessage: Message = { 
      role: 'user', 
      content: input,
      id: `user-${Date.now()}` 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add assistant response to chat with unique ID
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.reply,
        id: `assistant-${Date.now()}` 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message with unique ID
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        id: `error-${Date.now()}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom renderer for markdown elements
  const MarkdownComponents = {
    p: (props: any) => <p className="mb-2" {...props} />,
    h1: (props: any) => <h1 className="text-xl font-bold mb-2" {...props} />,
    h2: (props: any) => <h2 className="text-lg font-bold mb-2" {...props} />,
    h3: (props: any) => <h3 className="text-md font-bold mb-1" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-5 mb-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-5 mb-2" {...props} />,
    li: (props: any) => <li className="mb-1" {...props} />,
    strong: (props: any) => <strong className="font-bold" {...props} />,
    em: (props: any) => <em className="italic" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-green-300 pl-4 italic my-2" {...props} />,
    code: (props: any) => <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded" {...props} />,
  };

  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#F5F5F5] text-[#333333]`}>
      <Head>
        <title>Neura - AI Companion</title>
        <meta name="description" content="A supportive AI companion for meaningful conversations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-4xl mx-auto p-4 flex flex-col h-screen">
        <motion.header 
          className="py-4 border-b border-[#4CAF50]/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-center text-[#4CAF50]">Neura</h1>
          <p className="text-center text-[#333333]/70 text-sm mt-1">
            Your AI Therapist for meaningful conversations
          </p>
        </motion.header>

        <div className="flex-1 overflow-y-auto py-4 space-y-4" id="chat-messages">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={messageVariants}
                layout
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${message.role === 'user' 
                    ? 'bg-[#4CAF50] text-white' 
                    : 'bg-white text-[#333333] border border-[#4CAF50]/20'}`}
                >
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <ReactMarkdown components={MarkdownComponents}>
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white border border-[#4CAF50]/20 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-[#FFC107] animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-[#FFC107] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#FFC107] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="py-4 border-t border-[#4CAF50]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 rounded-full px-4 py-2 bg-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] shadow-sm transition-all duration-200 ease-in-out"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#4CAF50] hover:bg-[#43A047] text-white rounded-full px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#4CAF50] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
          </div>
        </motion.form>

        <motion.footer 
          className="text-center text-xs text-[#333333]/60 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p>Neura is an AI assistant, not a replacement for professional therapy.</p>
          <p>If you're experiencing a crisis, please contact a mental health professional or emergency services.</p>
        </motion.footer>
      </div>
    </div>
  );
}
