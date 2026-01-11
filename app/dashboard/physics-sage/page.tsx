"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, BookOpen, Zap, History, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function PhysicsSagePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "আসসালামু আলাইকুম! আমি আপনার **পদার্থবিজ্ঞান শিক্ষক**। NCTB পাঠ্যক্রম অনুযায়ী যেকোনো পদার্থবিজ্ঞানের প্রশ্নের উত্তর দিতে আমি এখানে আছি। 🌟\n\nআপনি কী জানতে চান?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/physics-tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get physics answer");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Physics Sage Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। অনুগ্রহ করে আবার চেষ্টা করুন।",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "আসসালামু আলাইকুম! আমি আপনার **পদার্থবিজ্ঞান শিক্ষক**। NCTB পাঠ্যক্রম অনুযায়ী যেকোনো পদার্থবিজ্ঞানের প্রশ্নের উত্তর দিতে আমি এখানে আছি। 🌟\n\nআপনি কী জানতে চান?",
        timestamp: new Date(),
      },
    ]);
  };

  const suggestedQuestions = [
    "কাজ ও ক্ষমতার মধ্যে পার্থক্য কী?",
    "নিউটনের গতির সূত্রগুলো কী?",
    "বলের একক কী?",
    "ঘর্ষণ বল কী এবং কেন এটি গুরুত্বপূর্ণ?",
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                পদার্থবিজ্ঞান শিক্ষক
                <Zap className="w-5 h-5 text-yellow-500" />
              </h1>
              <p className="text-sm text-gray-600">
                NCTB পাঠ্যক্রম অনুযায়ী বিশেষজ্ঞ সহায়তা
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            নতুন কথোপকথন
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex max-w-6xl mx-auto w-full">
        {/* Sidebar - Suggested Questions */}
        <div className="hidden lg:block w-72 p-4 bg-white/50 backdrop-blur-sm border-r border-gray-200 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                প্রস্তাবিত প্রশ্ন
              </h3>
              <div className="space-y-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    className="w-full text-left p-3 text-sm text-gray-700 bg-white hover:bg-indigo-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                সাম্প্রতিক বিষয়
              </h3>
              <div className="space-y-2">
                <div className="p-3 text-sm text-gray-600 bg-white rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-800">গতি ও ত্বরণ</p>
                  <p className="text-xs text-gray-500 mt-1">২ ঘণ্টা আগে</p>
                </div>
                <div className="p-3 text-sm text-gray-600 bg-white rounded-lg border border-gray-200">
                  <p className="font-medium text-gray-800">বল ও চাপ</p>
                  <p className="text-xs text-gray-500 mt-1">গতকাল</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                      : "bg-white text-gray-900 shadow-md border border-gray-200"
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              className="text-xl font-bold mt-3 mb-2 text-gray-900"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-lg font-bold mt-3 mb-2 text-gray-900"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-base font-semibold mt-2 mb-1 text-gray-800"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="mb-2 text-gray-800" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc pl-5 mb-2 space-y-1"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal pl-5 mb-2 space-y-1"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="text-gray-800" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold text-gray-900" {...props} />
                          ),
                          em: ({ node, ...props }) => (
                            <em className="italic" {...props} />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-indigo-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("bn-BD", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 shadow-md border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="আপনার পদার্থবিজ্ঞানের প্রশ্ন লিখুন..."
                  rows={1}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                  disabled={isTyping}
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                  পাঠান
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Shift + Enter দিয়ে নতুন লাইন তৈরি করুন
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
