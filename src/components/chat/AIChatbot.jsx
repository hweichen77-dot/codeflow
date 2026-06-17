import React, { useState, useRef, useEffect } from "react";
import { api, aiAvailable } from "@/api/apiClient";
import { MessageCircle, X, Send, Loader2, Brain, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = (lessonId) => `cf_chat_${lessonId}`;

export default function AIChatbot({ context = "", lessonTitle = "", lessonId = "", currentCode = "", lastOutput = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [socraticMode, setSocraticMode] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const defaultMessage = {
    role: "assistant",
    content: `Ask me anything about ${lessonTitle || "this lesson"}.`,
  };

  const [messages, setMessages] = useState(() => {
    if (!lessonId) return [defaultMessage];
    try {
      const stored = localStorage.getItem(STORAGE_KEY(lessonId));
      return stored ? JSON.parse(stored) : [defaultMessage];
    } catch {
      return [defaultMessage];
    }
  });

  // Persist messages per lesson
  useEffect(() => {
    if (lessonId && messages.length > 1) {
      try {
        localStorage.setItem(STORAGE_KEY(lessonId), JSON.stringify(messages));
      } catch {}
    }
  }, [messages, lessonId]);

  // Reset when lesson changes
  useEffect(() => {
    if (!lessonId) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY(lessonId));
      setMessages(stored ? JSON.parse(stored) : [defaultMessage]);
    } catch {
      setMessages([defaultMessage]);
    }
  }, [lessonId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    const conversationContext = newMessages
      .slice(-8)
      .map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
      .join("\n");

    const codeContext = currentCode?.trim()
      ? `\nStudent's current code:\n\`\`\`\n${currentCode}\n\`\`\``
      : "";

    const outputContext = lastOutput?.trim()
      ? `\nLast output/error:\n${lastOutput}`
      : "";

    const modeInstructions = socraticMode
      ? `IMPORTANT: You are in Socratic Mode. Never give direct answers or complete code. Instead, ask one guiding question that leads the student to discover the answer themselves. Point to the right direction without solving it.`
      : `You can explain directly and provide code examples when helpful. Be clear and concise.`;

    const response = await api.integrations.Core.InvokeLLM({
      prompt: `You are a coding tutor for "${lessonTitle}". ${modeInstructions}

Lesson context: ${context ? context.slice(0, 400) : lessonTitle}${codeContext}${outputContext}

Conversation:
${conversationContext}

Student: ${userMessage}

Respond in under 120 words. Be encouraging but don't be sycophantic.`,
    });

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: response || "Sorry, I couldn't process that. Try again!" },
    ]);
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 flex items-center justify-center transition-all duration-200"
              style={{ background: "#b8ff00", border: "1px solid #b8ff00", boxShadow: "0 4px 24px rgba(184,255,0,0.2)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(184,255,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(184,255,0,0.2)"; }}
            >
              <MessageCircle size={20} style={{ color: "#0a0a0a" }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] flex flex-col z-50 overflow-hidden"
            style={{
              height: "520px",
              background: "#0d0d0d",
              border: "1px solid #2a2a2a",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#b8ff0015", border: "1px solid #b8ff0033" }}>
                  <Brain size={12} style={{ color: "#b8ff00" }} />
                </div>
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#d4d4d4" }}>
                  AI Tutor
                </span>
                <span className="font-mono text-xs" style={{ color: "#e8e8e8" }}>·</span>
                <span className="font-mono text-xs" style={{ color: "#c4c4c4" }} title={lessonTitle}>
                  {lessonTitle?.length > 18 ? lessonTitle.slice(0, 18) + "…" : lessonTitle}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ color: "#e8e8e8" }}
                onMouseEnter={e => e.currentTarget.style.color = "#d4d4d4"}
                onMouseLeave={e => e.currentTarget.style.color = "#e8e8e8"}
              >
                <X size={14} />
              </button>
            </div>

            {/* Mode toggle */}
            <div
              className="flex items-center gap-3 px-5 py-2.5 flex-shrink-0"
              style={{ borderBottom: "1px solid #111", background: "#080808" }}
            >
              <span className="font-mono text-xs" style={{ color: "#e8e8e8" }}>mode:</span>
              <button
                onClick={() => setSocraticMode(true)}
                className="font-mono text-xs px-3 py-1 transition-all duration-150"
                style={{
                  color: socraticMode ? "#b8ff00" : "#e8e8e8",
                  border: `1px solid ${socraticMode ? "#b8ff0033" : "#1a1a1a"}`,
                  background: socraticMode ? "#b8ff0010" : "transparent",
                }}
              >
                Socratic
              </button>
              <button
                onClick={() => setSocraticMode(false)}
                className="font-mono text-xs px-3 py-1 transition-all duration-150"
                style={{
                  color: !socraticMode ? "#b8ff00" : "#e8e8e8",
                  border: `1px solid ${!socraticMode ? "#b8ff0033" : "#1a1a1a"}`,
                  background: !socraticMode ? "#b8ff0010" : "transparent",
                }}
              >
                Direct
              </button>
              {currentCode && (
                <span className="ml-auto font-mono text-xs flex items-center gap-1" style={{ color: "#e8e8e8" }}>
                  <Zap size={9} />
                  code-aware
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[85%] px-4 py-2.5 font-display text-sm leading-relaxed"
                    style={{
                      background: msg.role === "user" ? "#1a1a1a" : "#141414",
                      border: `1px solid ${msg.role === "user" ? "#2a2a2a" : "#1e1e1e"}`,
                      color: msg.role === "user" ? "#e8e8e8" : "#d4d4d4",
                      fontWeight: 400,
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
                    <Loader2 size={12} className="animate-spin" style={{ color: "#b8ff00" }} />
                    <span className="font-mono text-xs" style={{ color: "#e8e8e8" }}>thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid #1a1a1a" }}>
              {aiAvailable ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask about this lesson..."
                    className="flex-1 font-mono text-xs py-2.5 px-3 bg-transparent outline-none"
                    style={{ border: "1px solid #1e1e1e", color: "#e8e8e8", caretColor: "#b8ff00" }}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="px-3 py-2.5 transition-all duration-150 disabled:opacity-30"
                    style={{ background: "#b8ff00", border: "1px solid #b8ff00" }}
                  >
                    <Send size={12} style={{ color: "#0a0a0a" }} />
                  </button>
                </div>
              ) : (
                <p className="font-mono text-xs leading-relaxed" style={{ color: "#c4c4c4" }}>
                  AI tutor is offline in this build — it lights up when the app is connected to its AI backend.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}