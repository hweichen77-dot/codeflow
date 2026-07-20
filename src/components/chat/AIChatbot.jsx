import React, { useState, useRef, useEffect } from "react";
import { aiAvailable } from "@/api/apiClient";
import { askTutor } from "@/lib/aiTutor";
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

  useEffect(() => {
    if (lessonId && messages.length > 1) {
      try {
        localStorage.setItem(STORAGE_KEY(lessonId), JSON.stringify(messages));
      } catch {}
    }
  }, [messages, lessonId]);

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

    const res = await askTutor({
      messages: newMessages.filter((m) => m.role === "user" || m.role === "assistant"),
      lessonTitle,
      context: context ? context.slice(0, 1200) : lessonTitle,
      socratic: socraticMode,
      currentCode: currentCode || "",
      lastOutput: lastOutput || "",
    });

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: res.ok
          ? res.reply
          : res.error || "Sorry, I couldn't process that. Try again!",
      },
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
              aria-label="Open AI tutor chat"
              className="w-14 h-14 flex items-center justify-center transition-all duration-200"
              style={{ background: "#5ED29C", border: "1px solid #5ED29C", boxShadow: "0 4px 24px rgba(94,210,156,0.2)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(94,210,156,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(94,210,156,0.2)"; }}
            >
              <MessageCircle size={20} style={{ color: "#070B0A" }} />
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
              background: "#070B0A",
              border: "1px solid #26302B",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid #17201C", background: "#070B0A" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center" style={{ background: "#5ED29C15", border: "1px solid #5ED29C33" }}>
                  <Brain size={12} style={{ color: "#5ED29C" }} />
                </div>
                <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#FFFFFF" }}>
                  AI Tutor
                </span>
                <span className="font-sans text-xs" style={{ color: "#ECF3EF" }}>·</span>
                <span className="font-sans text-xs" style={{ color: "#FFFFFF" }} title={lessonTitle}>
                  {lessonTitle?.length > 18 ? lessonTitle.slice(0, 18) + "…" : lessonTitle}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close AI tutor chat"
                style={{ color: "#ECF3EF" }}
                onMouseEnter={e => e.currentTarget.style.color = "#CBD6D0"}
                onMouseLeave={e => e.currentTarget.style.color = "#ECF3EF"}
              >
                <X size={14} />
              </button>
            </div>

            <div
              className="flex items-center gap-3 px-5 py-2.5 flex-shrink-0"
              style={{ borderBottom: "1px solid #0C1210", background: "#080808" }}
            >
              <span className="font-sans text-xs" style={{ color: "#ECF3EF" }}>mode:</span>
              <button
                onClick={() => setSocraticMode(true)}
                className="font-sans text-xs px-3 py-1 transition-all duration-150"
                style={{
                  color: socraticMode ? "#5ED29C" : "#ECF3EF",
                  border: `1px solid ${socraticMode ? "#5ED29C33" : "#17201C"}`,
                  background: socraticMode ? "#5ED29C10" : "transparent",
                }}
              >
                Socratic
              </button>
              <button
                onClick={() => setSocraticMode(false)}
                className="font-sans text-xs px-3 py-1 transition-all duration-150"
                style={{
                  color: !socraticMode ? "#5ED29C" : "#ECF3EF",
                  border: `1px solid ${!socraticMode ? "#5ED29C33" : "#17201C"}`,
                  background: !socraticMode ? "#5ED29C10" : "transparent",
                }}
              >
                Direct
              </button>
              {currentCode && (
                <span className="ml-auto font-sans text-xs flex items-center gap-1" style={{ color: "#ECF3EF" }}>
                  <Zap size={9} />
                  code-aware
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[85%] px-4 py-2.5 font-display text-sm leading-relaxed"
                    style={{
                      background: msg.role === "user" ? "#17201C" : "#1F1C15",
                      border: `1px solid ${msg.role === "user" ? "#26302B" : "#17201C"}`,
                      color: msg.role === "user" ? "#ECF3EF" : "#CBD6D0",
                      fontWeight: 400,
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "#1F1C15", border: "1px solid #17201C" }}>
                    <Loader2 size={12} className="animate-spin" style={{ color: "#5ED29C" }} />
                    <span className="font-sans text-xs" style={{ color: "#ECF3EF" }}>thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid #17201C" }}>
              {aiAvailable ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask about this lesson..."
                    aria-label="Ask the AI tutor a question"
                    className="flex-1 font-sans text-xs py-2.5 px-3 bg-transparent outline-none"
                    style={{ border: "1px solid #17201C", color: "#ECF3EF", caretColor: "#5ED29C" }}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="px-3 py-2.5 transition-all duration-150 disabled:opacity-30"
                    style={{ background: "#5ED29C", border: "1px solid #5ED29C" }}
                  >
                    <Send size={12} style={{ color: "#070B0A" }} />
                  </button>
                </div>
              ) : (
                <p className="font-sans text-xs leading-relaxed" style={{ color: "#FFFFFF" }}>
                  AI tutor is offline in this build, it lights up when the app is connected to its AI backend.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}