"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  Brain,
  MessageSquare,
  Code,
  Image,
  FileText,
  Loader2,
  Copy,
  Check,
  Trash2,
  Mic,
  Settings,
  ChevronDown,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AI_RESPONSES = [
  "I understand! Let me help you with that. Here's what I found...",
  "That's a fascinating question! Based on my analysis, I would suggest...",
  "I've processed your request and here are my insights...",
  "Great question! Let me break this down for you step by step...",
  "I'm analyzing your input now. Here are some key points to consider...",
];

const CAPABILITIES = [
  { icon: MessageSquare, label: "Conversations", desc: "Natural dialogue" },
  { icon: Code, label: "Code", desc: "Write & debug" },
  { icon: Image, label: "Vision", desc: "Analyze images" },
  { icon: FileText, label: "Documents", desc: "Read & summarize" },
];

function generateResponse(userMessage: string): string {
  const base = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
  const followUp = `\n\nRegarding "${userMessage.slice(0, 50)}${userMessage.length > 50 ? "..." : ""}", I can provide detailed analysis, creative suggestions, or technical solutions depending on your needs.\n\nWhat would you like to explore next?`;
  return base + followUp;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Welcome to Nexus AI! I'm your intelligent agent ready to help with conversations, coding, analysis, and creative tasks. What can I do for you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "👋 Welcome to Nexus AI! I'm your intelligent agent ready to help with conversations, coding, analysis, and creative tasks. What can I do for you today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-glow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Nexus AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {messages.length <= 1 && (
        <div className="px-4 pt-12 pb-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-slate-300 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Powered by Advanced AI</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient">Your Intelligent</span>
              <br />
              <span className="text-white">AI Agent</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
              Experience next-generation AI assistance. From coding to creative
              writing, analysis to problem-solving — I'm here to help.
            </p>

            {/* Capabilities */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
              {CAPABILITIES.map((cap) => (
                <div
                  key={cap.label}
                  className="glass rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <cap.icon className="w-6 h-6 text-indigo-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-medium text-white">
                    {cap.label}
                  </div>
                  <div className="text-xs text-slate-400">{cap.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                    : "bg-slate-700"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "assistant"
                    ? "glass text-slate-200"
                    : "bg-indigo-600 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.role === "assistant" && (
                    <button
                      onClick={() =>
                        copyMessage(message.id, message.content)
                      }
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="text-sm text-slate-400">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-strong rounded-2xl p-2">
            <div className="flex items-end gap-2">
              <button className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-slate-400 hover:text-white flex-shrink-0">
                <Mic className="w-5 h-5" />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Nexus AI..."
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-slate-500 resize-none outline-none py-2.5 text-sm min-h-[44px] max-h-[200px]"
                style={{ height: "auto" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">
            Nexus AI can make mistakes. Consider checking important
            information.
          </p>
        </div>
      </div>
    </main>
  );
}
