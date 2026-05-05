import { useState } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '../analytics';
import './CipherCrack.css';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function CipherCrack({ level, onComplete }) {
  const { cipher } = level;
  const [slots, setSlots] = useState(Array(cipher.answerLength).fill(''));
  const [activeSlot, setActiveSlot] = useState(0);
  const [status, setStatus] = useState('idle');

  const handleLetter = (letter) => {
    if (status === 'success') return;
    const newSlots = [...slots];
    newSlots[activeSlot] = letter;
    setSlots(newSlots);
    if (activeSlot < cipher.answerLength - 1) {
      setActiveSlot(activeSlot + 1);
    }
  };

  const handleBackspace = () => {
    if (status === 'success') return;
    if (slots[activeSlot] !== '') {
      const newSlots = [...slots];
      newSlots[activeSlot] = '';
      setSlots(newSlots);
    } else if (activeSlot > 0) {
      setActiveSlot(activeSlot - 1);
      const newSlots = [...slots];
      newSlots[activeSlot - 1] = '';
      setSlots(newSlots);
    }
  };

  const handleSubmit = () => {
    const word = slots.join('');
    if (word.length < cipher.answerLength) return;
    trackEvent('cipher_submitted', { level: level.id, word });
    if (word === cipher.solution) {
      setStatus('success');
      trackEvent(`level_${level.id}_cipher_success`);
      setTimeout(onComplete, 1800);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 800);
    }
  };

  return (
    <div className="cipher-crack">
      <div className="parchment">
        <h3 className="parchment-title">Ancient Runes</h3>

        <div className="encrypted-word">
          {cipher.encrypted.split('').map((sym, i) => (
            <span key={i} className="cipher-symbol">{sym}</span>
          ))}
        </div>

        <div className="slots-row">
          {slots.map((letter, i) => (
            <div
              key={i}
              className={`slot ${activeSlot === i ? 'active' : ''} ${letter ? 'filled' : ''} ${status === 'success' ? 'glow' : ''}`}
              onClick={() => { if (status !== 'success') setActiveSlot(i); }}
            >
              {letter || '?'}
            </div>
          ))}
        </div>

        <div className="cipher-key">
          <p className="key-title">Cipher Key</p>
          <div className="key-grid">
            {cipher.key.map((item, i) => (
              <div key={i} className="key-item">
                <span className="key-symbol">{item.symbol}</span>
                <span className="key-arrow">→</span>
                <span className="key-letter">{item.letter}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="letter-keyboard">
        {LETTERS.map(letter => (
          <button
            key={letter}
            className="letter-btn"
            onClick={() => handleLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="cipher-actions">
        <button className="magic-button secondary" onClick={handleBackspace}>⌫</button>
        <button className="magic-button" onClick={handleSubmit}>Unlock</button>
      </div>

      {status === 'error' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="feedback-error">
          That's not the right word. Try again!
        </motion.p>
      )}
      {status === 'success' && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="feedback-success">
          ✨ The parchment glows! Footprints appear on the map! ✨
        </motion.p>
      )}
    </div>
  );
}
