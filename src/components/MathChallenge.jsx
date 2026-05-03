import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../analytics';
import './MathChallenge.css';

export function MathChallenge({ level, onComplete }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'error', 'success'
  const { problem } = level;

  const handleNumberTap = (num) => {
    if (status === 'success') return;
    setStatus('idle');
    if (input.length < 3) {
      const newVal = input + num;
      setInput(newVal);
      trackEvent('math_keypad_tap', { level: level.id, value: num });
    }
  };

  const handleClear = () => {
    setInput('');
    setStatus('idle');
    trackEvent('math_input_cleared', { level: level.id });
  };

  const handleSubmit = () => {
    if (input === '') return;
    
    const isCorrect = parseInt(input) === problem.solution;
    
    if (isCorrect) {
      setStatus('success');
      trackEvent(`level_${level.id}_math_completed`, { attempts: input.length });
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      setTimeout(onComplete, 1200);
    } else {
      setStatus('error');
      trackEvent('math_incorrect_attempt', { level: level.id, entered: input });
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(() => {
        setStatus('idle');
        setInput('');
      }, 800);
    }
  };

  return (
    <div className="math-challenge">
      {/* Problem Display */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="problem-card"
      >
        <p className="problem-text">{problem.text}</p>
        
        <div className="visual-hints">
          <div className="hint-row">
            <span>{Array(5).fill(problem.items.broom.icon).join('')} = $50</span>
          </div>
          <div className="hint-row">
            <span>{problem.items.broom.icon}{problem.items.broom.icon} + {problem.items.key.icon} = $35</span>
          </div>
        </div>
      </motion.div>

      {/* Answer Area */}
      <div className={`answer-display ${status}`}>
        <span className="dollar-sign">$</span>
        <span className="answer-value">{input || '?'}</span>
      </div>

      {/* Keypad */}
      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map((key) => {
          let onClick = () => handleNumberTap(key);
          if (key === 'C') onClick = handleClear;
          if (key === '✓') onClick = handleSubmit;

          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.9 }}
              className={`keypad-btn ${key === '✓' ? 'submit' : ''} ${key === 'C' ? 'clear' : ''}`}
              onClick={onClick}
            >
              {key}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="feedback-error"
          >
            Not quite right... Try again!
          </motion.p>
        )}
        {status === 'success' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="feedback-success"
          >
            Brilliant Deduction!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
