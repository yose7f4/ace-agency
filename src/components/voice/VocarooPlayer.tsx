'use client';

import React, { useState } from 'react';
import { Mic, ExternalLink, Play, Check } from 'lucide-react';

interface VocarooPlayerProps {
  url: string | null | undefined;
  candidateName?: string;
}

export function VocarooPlayer({ url, candidateName }: VocarooPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!url || !url.trim()) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 italic">
        <Mic className="w-3.5 h-3.5 opacity-40" />
        No Voice Note
      </span>
    );
  }

  // Extract Vocaroo ID from vocaroo.com/ID or voca.ro/ID
  const vocarooIdMatch = url.match(/(?:vocaroo\.com\/|voca\.ro\/)([a-zA-Z0-9]+)/);
  const vocarooId = vocarooIdMatch ? vocarooIdMatch[1] : null;

  if (vocarooId) {
    return (
      <div className="flex flex-col gap-1.5 min-w-[220px]">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
            <Mic className="w-3 h-3 text-amber-400 animate-pulse" />
            Vocaroo Audio
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5 underline transition-colors"
            title="Open in new tab"
          >
            Direct Link <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
        <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950/80 shadow-inner">
          <iframe
            width="100%"
            height="50"
            src={`https://vocaroo.com/embed/${vocarooId}?autoplay=0`}
            frameBorder="0"
            allow="autoplay"
            title={`Voice Note for ${candidateName || 'Candidate'}`}
            className="w-full h-[50px] block"
          />
        </div>
      </div>
    );
  }

  // Fallback for non-standard link
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
    >
      <Mic className="w-3.5 h-3.5" />
      Play Voice Note
      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
    </a>
  );
}
