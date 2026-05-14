/**
 * ICUNI Connect — Animated Brand Text
 * Smooth morphing: ICUNI → I · C · U · N · I → I see you and I → fold back
 * Letters spread apart, then inner letters morph into full words.
 */
import React, { useState, useEffect } from 'react';

const PHASES = [
  { id: 'compact',  hold: 2500 },
  { id: 'dotted',   hold: 1800 },
  { id: 'expanded', hold: 3200 },
  { id: 'dotted',   hold: 1000 },
];

// Each block: the visible letter, what it morphs into when expanded, and whether to show a dot after
const BLOCKS = [
  { letter: 'I', word: null },       // "I" stays as I
  { letter: 'C', word: 'see' },      // C → "see"
  { letter: 'U', word: 'you' },      // U → "you"
  { letter: 'N', word: 'and' },      // N → "and"
  { letter: 'I', word: null },       // "I" stays as I
];

export default function AnimatedBrandText() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(p => (p + 1) % PHASES.length);
    }, PHASES[phase].hold);
    return () => clearTimeout(timer);
  }, [phase]);

  const current = PHASES[phase].id;
  const isSpread = current === 'dotted' || current === 'expanded';
  const isExpanded = current === 'expanded';

  return (
    <div className="brand-anim">
      <div className={`brand-glow ${isExpanded ? 'active' : ''}`} />

      <h1 className={`brand-morph ${isSpread ? 'spread' : ''}`}>
        {BLOCKS.map((b, i) => (
          <span key={i} className="brand-block">
            {/* The letter — hides when expanded and has a word replacement */}
            <span className={`brand-letter ${isExpanded && b.word ? 'hidden' : ''}`}>
              {b.letter}
            </span>
            {/* The full word — only for C, U, N */}
            {b.word && (
              <span className={`brand-expand-word ${isExpanded ? 'show' : ''}`}>
                {b.word}
              </span>
            )}
            {/* Dot separator (between letters, not after last) */}
            {i < BLOCKS.length - 1 && isSpread && !isExpanded && (
              <span className="brand-dot">·</span>
            )}
          </span>
        ))}
      </h1>

      <p className={`brand-tagline ${isExpanded ? 'hidden' : ''}`}>
        Ghana's Creative Talent Directory
      </p>
    </div>
  );
}
