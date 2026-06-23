import React, { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { trace } from "@/components/lesson/trace/theme";

/**
 * Renders an embedded YouTube video with a thumbnail preview
 * and a "Watch on YouTube" fallback link.
 *
 * OPTIONAL / dormant feature. It is wired up in LessonEnhancements.jsx and only
 * renders when a lesson supplies `video_id` (plus optional `video_title` /
 * `video_caption`). No lesson currently sets those fields, so this component is
 * inactive by default — kept intentionally so authors can attach a concept
 * video to any lesson without new plumbing. Returns null when `youtubeId` is
 * absent, so it is safe to leave in place.
 */
export default function ConceptVideo({ youtubeId, title, caption }) {
  const [playing, setPlaying] = useState(false);

  if (!youtubeId) return null;

  const thumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className="my-6" style={{ border: `1px solid ${trace.border}`, background: trace.raised, borderRadius: "4px" }}>
      {/* header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: `1px solid ${trace.border}` }}
      >
        <span className="font-mono text-xs tracking-widest uppercase flex items-center gap-1.5" style={{ color: trace.dim }}>
          <Play size={11} fill={trace.dim} style={{ color: trace.dim }} />
          Video Explanation
        </span>
        {title && (
          <span className="font-display text-xs" style={{ color: trace.dim }}>{title}</span>
        )}
      </div>

      {/* player */}
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
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer group"
            onClick={() => setPlaying(true)}
            style={{ background: trace.surface }}
          >
            <img
              src={thumb}
              alt={title || "Video thumbnail"}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.85 }}
            />
            <div
              className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 group-hover:scale-110"
              style={{ background: trace.lime, boxShadow: "0 0 30px rgba(232,163,60,0.3)" }}
            >
              <Play size={20} fill={trace.bg} style={{ color: trace.bg, marginLeft: "2px" }} />
            </div>
          </div>
        )}
      </div>

      {/* caption */}
      {caption && (
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderTop: `1px solid ${trace.border}` }}
        >
          <span className="font-display text-xs" style={{ color: trace.dim }}>{caption}</span>
          <a
            href={`https://youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs transition-colors"
            style={{ color: trace.dim }}
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
