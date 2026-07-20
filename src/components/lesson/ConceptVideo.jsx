import React, { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { trace } from "@/components/lesson/trace/theme";

export default function ConceptVideo({ youtubeId, title, caption }) {
  const [playing, setPlaying] = useState(false);

  if (!youtubeId) return null;

  const thumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className="my-6" style={{ border: `1px solid ${trace.border}`, background: trace.raised, borderRadius: "4px" }}>
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: `1px solid ${trace.border}` }}
      >
        <span className="font-sans text-xs tracking-widest uppercase flex items-center gap-1.5" style={{ color: '#FFFFFF' }}>
          <Play size={11} fill={trace.dim} style={{ color: '#FFFFFF' }} />
          Video Explanation
        </span>
        {title && (
          <span className="font-display text-xs" style={{ color: '#FFFFFF' }}>{title}</span>
        )}
      </div>

      <div className="relative" style={{ paddingBottom: "56.25%", height: 0 }}>
        {playing ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Video"}
          />
        ) : (
          <button
            type="button"
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer group"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title || "Video explanation"}`}
            style={{ background: trace.surface, border: 0, padding: 0 }}
          >
            <img
              src={thumb}
              alt={title || "Video thumbnail"}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.85 }}
            />
            <div
              className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 group-hover:scale-110"
              style={{ background: trace.lime, boxShadow: "0 0 30px rgba(94,210,156,0.3)" }}
            >
              <Play size={20} fill={trace.bg} style={{ color: trace.bg, marginLeft: "2px" }} />
            </div>
          </button>
        )}
      </div>

      {caption && (
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderTop: `1px solid ${trace.border}` }}
        >
          <span className="font-display text-xs" style={{ color: '#FFFFFF' }}>{caption}</span>
          <a
            href={`https://youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-sans text-xs transition-colors"
            style={{ color: '#FFFFFF' }}
            onMouseEnter={e => e.currentTarget.style.color = trace.lime}
            onMouseLeave={e => e.currentTarget.style.color = trace.dim}
          >
            <ExternalLink size={10} />
            YouTube
          </a>
        </div>
      )}
    </div>
  );
}
