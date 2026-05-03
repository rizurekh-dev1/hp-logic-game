import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../analytics';
import './PatternMatch.css';

function Rune({ rotation, dots, size = 'medium' }) {
  return (
    <div className={`rune ${size}`} style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="rune-triangle" />
      <div className="dots-container">
        {Array.from({ length: dots }).map((_, i) => (
          <div key={i} className="rune-dot" />
        ))}
      </div>
    </div>
  );
}

export function PatternMatch({ level, onComplete }) {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'error', 'success'
  const { pattern } = level;

  const handleSelect = (optionId) => {
    if (status === 'success') return;
    setSelectedOptionId(optionId);
    setStatus('idle');
    trackEvent('pattern_option_selected', { level: level.id, optionId });
  };

  const handleSubmit = () => {
    if (!selectedOptionId || status !== 'idle') return;

    const option = pattern.options.find(o => o.id === selectedOptionId);
    
    if (option.isCorrect) {
      setStatus('success');
      trackEvent(`level_${level.id}_pattern_success`);
      if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100]);
      setTimeout(onComplete, 1800);
    } else {
      setStatus('error');
      trackEvent('pattern_incorrect_attempt', { level: level.id, optionId: selectedOptionId });
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => setStatus('idle'), 1200);
    }
  };

  const selectedOption = pattern.options.find(o => o.id === selectedOptionId);

  return (
    <div className="pattern-match">
      {/* The Mirror */}
      <div className="mirror-container">
        <div className="mirror-frame">
          <div className="mirror-glass">
            <div className="sequence-row">
              {pattern.sequence.map((item, i) => (
                <div key={i} className="sequence-item">
                  <Rune rotation={item.rotation} dots={item.dots} size="small" />
                </div>
              ))}
              <div className="sequence-item next-placeholder">
                <AnimatePresence mode="wait">
                  {selectedOption ? (
                    <motion.div
                      key={selectedOption.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Rune rotation={selectedOption.rotation} dots={selectedOption.dots} size="small" />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="placeholder"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="question-mark"
                    >
                      ?
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="options-area">
        <h4 className="options-title">Select the Correct Rune:</h4>
        <div className="options-grid">
          {pattern.options.map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(option.id)}
              className={`option-btn ${selectedOptionId === option.id ? 'selected' : ''}`}
            >
              <Rune rotation={option.rotation} dots={option.dots} size="mini" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="action-area">
        <button
          className={`magic-button ${!selectedOptionId ? 'disabled' : ''} ${status}`}
          onClick={handleSubmit}
          disabled={!selectedOptionId || status === 'success'}
        >
          {status === 'success' ? 'Revealing the Stone...' : 'Reveal Truth'}
        </button>
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pattern-error"
          >
            The mirror remains clouded. That is not the true reflection.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
