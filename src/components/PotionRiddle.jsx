import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../analytics';
import './PotionRiddle.css';

export function PotionRiddle({ level, onComplete }) {
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'error', 'success'
  const { riddle } = level;

  const handleSelect = (id) => {
    if (status === 'success') return;
    setSelectedId(id);
    setStatus('idle');
    trackEvent('potion_selected', { level: level.id, color: id });
  };

  const handleDrink = () => {
    if (!selectedId || status !== 'idle') return;

    const isCorrect = selectedId === riddle.solution;

    if (isCorrect) {
      setStatus('success');
      trackEvent(`level_${level.id}_potions_success`);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(onComplete, 1500);
    } else {
      setStatus('error');
      trackEvent('potion_incorrect_attempt', { level: level.id, color: selectedId });
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => setStatus('idle'), 1200);
    }
  };

  return (
    <div className="potion-riddle">
      {/* Scroll area for clues */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="clue-scroll"
      >
        <h3 className="scroll-title">The Potion Riddler</h3>
        <ul className="clue-list">
          {riddle.clues.map((clue, i) => (
            <li key={i} className="clue-item">{clue}</li>
          ))}
        </ul>
      </motion.div>

      {/* The Shelf */}
      <div className="potion-shelf">
        <div className="shelf-wood" />
        <div className="bottles-row">
          {riddle.bottles.map((bottle) => (
            <motion.div
              key={bottle.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(bottle.id)}
              className={`potion-bottle ${selectedId === bottle.id ? 'selected' : ''}`}
            >
              <div 
                className="bottle-fluid" 
                style={{ backgroundColor: bottle.color }} 
              />
              <div className="bottle-glass" />
              {selectedId === bottle.id && (
                <motion.div 
                  layoutId="glow"
                  className="bottle-glow"
                  style={{ boxShadow: `0 0 20px ${bottle.color}` }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="action-area">
        <p className="selected-hint">
          {selectedId ? `You've chosen the ${selectedId} potion...` : 'Carefully inspect the bottles...'}
        </p>
        <button
          className={`magic-button ${!selectedId ? 'disabled' : ''} ${status}`}
          onClick={handleDrink}
          disabled={!selectedId || status === 'success'}
        >
          {status === 'success' ? 'Portal Opening...' : 'Drink Potion'}
        </button>
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="potion-feedback error"
          >
            {riddle.failureMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
