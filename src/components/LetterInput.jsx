import { useState } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '../analytics';
import './LetterInput.css';

export function LetterInput({ level, onComplete }) {
  const { question } = level;
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = () => {
    const answer = input.trim().toUpperCase();
    if (!answer) return;

    trackEvent('letter_submitted', { level: level.id, answer });

    if (answer === question.correctAnswer) {
      setStatus('success');
      trackEvent(`level_${level.id}_letter_success`);
      setTimeout(onComplete, 1500);
    } else {
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setInput('');
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="letter-input">
      <div className="letter-card">
        {question.image && (
          <img src={question.image} alt="Puzzle" className="letter-image" />
        )}
        <p className="letter-text">{question.text}</p>
      </div>

      <div className="input-section">
        <input
          type="text"
          className="letter-input-box"
          placeholder="Type A, B, C, or D"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          maxLength={1}
          disabled={status === 'success'}
        />
        <button
          className={`magic-button ${!input.trim() ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={status === 'success'}
        >
          Submit Answer
        </button>
      </div>

      {status === 'error' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="feedback-error">
          Not quite right! Look at the shadows again and try another letter.
        </motion.p>
      )}
      {status === 'success' && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="feedback-success">
          Correct! The Knight Bus squeezes through!
        </motion.p>
      )}
    </div>
  );
}
