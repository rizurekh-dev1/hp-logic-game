import { useState } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '../analytics';
import './MultipleChoice.css';

export function MultipleChoice({ level, onComplete }) {
  const { question } = level;
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleSelect = (id) => {
    if (status === 'success') return;
    setSelected(id);
    setStatus('idle');
  };

  const handleSubmit = () => {
    if (!selected) return;
    const chosen = question.options.find(o => o.id === selected);
    trackEvent('choice_submitted', { level: level.id, selected });
    if (chosen?.isCorrect) {
      setStatus('success');
      trackEvent(`level_${level.id}_choice_success`);
      setTimeout(onComplete, 1500);
    } else {
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setSelected(null);
      }, 800);
    }
  };

  return (
    <div className="multiple-choice">
      <div className="choice-card">
        {question.image && (
          <img src={question.image} alt="Puzzle" className="choice-image" />
        )}
        <p className="choice-text">{question.text}</p>
        {question.visualHints && (
          <div className="choice-hints">
            {question.visualHints.map((hint, i) => (
              <div key={i} className="hint-line">{hint.content}</div>
            ))}
          </div>
        )}
      </div>

      <div className="options-list">
        {question.options.map(opt => (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.97 }}
            className={`option-card ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.id)}
          >
            <span className="option-id">{opt.id}</span>
            <span className="option-label">{opt.label}</span>
          </motion.button>
        ))}
      </div>

      <button
        className={`magic-button ${!selected ? 'disabled' : ''}`}
        onClick={handleSubmit}
      >
        Confirm Answer
      </button>

      {status === 'error' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="feedback-error">
          Wrong measurements — the fence won't fit! Try again.
        </motion.p>
      )}
      {status === 'success' && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="feedback-success">
          Perfect measurements! The fence snaps into place!
        </motion.p>
      )}
    </div>
  );
}
