import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTERS } from '../config/storyline';
import './StoryDialogue.css';

function TextReveal({ text, speed = 25, onComplete }) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(0);
    if (!text) return;

    const total = text.length;
    const step = Math.max(1, Math.floor(total / 60));

    const interval = setInterval(() => {
      setRevealed(prev => {
        const next = prev + step;
        if (next >= total) {
          clearInterval(interval);
          onComplete?.();
          return total;
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span>
      {text.slice(0, revealed)}
      {revealed < text.length && <span className="cursor-blink">|</span>}
    </span>
  );
}

export function StoryDialogue({ queue, onComplete }) {
  const [index, setIndex] = useState(0);
  const [textDone, setTextDone] = useState(false);

  const current = queue[index];
  const isLast = index === queue.length - 1;
  const character = current ? CHARACTERS[current.character] : null;

  const handleTextDone = useCallback(() => {
    setTextDone(true);
  }, []);

  const handleTap = () => {
    if (!textDone) {
      setTextDone(true);
      return;
    }
    if (!isLast) {
      setIndex(i => i + 1);
      setTextDone(false);
    } else {
      onComplete();
    }
  };

  if (!current || !character) return null;

  return (
    <motion.div
      className="story-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleTap}
    >
      <div className="story-background">
        <div className="story-particles" />
      </div>

      <div className="story-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="dialogue-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div
              className="character-avatar"
              style={{ background: character.gradient }}
            >
              <img
                src={character.avatar}
                alt={character.name}
                className="character-avatar-img"
              />
            </div>

            <div
              className="character-name"
              style={{ color: character.color }}
            >
              {character.name}
            </div>

            <p className="dialogue-text">
              <TextReveal
                text={current.text}
                onComplete={handleTextDone}
              />
            </p>

            <div className="dialogue-control">
              <span className="tap-hint">
                {textDone
                  ? (isLast ? '✨ Continue' : '→ Next')
                  : 'Tap to reveal'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="story-progress">
        {queue.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i === index ? 'active' : ''} ${i < index ? 'done' : ''}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
