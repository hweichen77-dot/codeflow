import React, { useState, useRef, useEffect } from "react";
import { Play, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CodeEditor({ code, onChange, onRun, output, isRunning }) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const lines = (code || "").split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="bg-[#1E1E2E] rounded-2xl overflow-hidden shadow-xl border border-gray-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#181825] border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-xs text-gray-500 font-mono">editor.js</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-7 px-2"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-7 px-2"
            onClick={() => onChange("")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            className="bg-[#00B894] hover:bg-[#00A383] text-white h-7 px-3 text-xs font-medium rounded-lg gap-1.5"
            onClick={onRun}
            disabled={isRunning}
          >
            <Play className="w-3 h-3" />
            Run
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex relative min-h-[280px] max-h-[500px]">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="py-4 px-3 text-right text-gray-600 text-sm font-mono select-none overflow-hidden leading-6 flex-shrink-0"
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          className="flex-1 bg-transparent text-[#CDD6F4] font-mono text-sm p-4 pl-2 resize-none outline-none leading-6 overflow-auto"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Output Panel */}
      {output !== undefined && output !== null && (
        <div className="border-t border-gray-800/60">
          <div className="px-4 py-2 bg-[#181825] text-xs text-gray-500 font-medium uppercase tracking-wider">
            Output
          </div>
          <div className="p-4 font-mono text-sm min-h-[60px] max-h-[200px] overflow-auto">
            {output.split("\n").map((line, i) => (
              <div
                key={i}
                className={line.startsWith("Error") || line.startsWith("❌") ? "text-[#FF7675]" : "text-[#00B894]"}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}