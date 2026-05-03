import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../analytics';
import './BossDuel.css';

// Reusable Rune component (simplified version for the duel)
function Rune({ rotation, dots }) {
  return (
    <div className="duel-rune" style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="rune-triangle-boss" />
      <div className="dots-container-boss">
        {Array.from({ length: dots }).map((_, i) => (
          <div key={i} className="rune-dot-boss" />
        ))}
      </div>
    </div>
  );
}

export function BossDuel({ level, onComplete }) {
  const [phase, setPhase] = useState(1);
  const [bossHealth, setBossHealth] = useState(100);
  const [status, setStatus] = useState('idle');
  const [selectedId, setSelectedId] = useState(null);
  
  const { duel } = level;

  const handlePhase1Select = (option) => {
    if (status !== 'idle') return;
    
    if (option.isCorrect) {
      setStatus('correct');
      setBossHealth(50);
      trackEvent('boss_phase_1_complete');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(() => {
        setPhase(2);
        setStatus('idle');
        setSelectedId(null);
      }, 1500);
    } else {
      setStatus('error');
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => setStatus('idle'), 1000);
    }
  };

  const handlePhase2Select = (option) => {
    if (status !== 'idle') return;
    setSelectedId(option.id);

    if (option.isCorrect) {
      setStatus('correct');
      setBossHealth(0);
      trackEvent('boss_phase_2_complete');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      setTimeout(onComplete, 2000);
    } else {
      setStatus('error');
      if (navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => {
        setStatus('idle');
        setSelectedId(null);
      }, 1200);
    }
  };

  return (
    <div className="boss-duel">
      {/* Boss Health Bar */}
      <div className="boss-header">
        <div className="boss-name">Professor Quirrell</div>
        <div className="health-container">
          <motion.div 
            className="health-bar" 
            animate={{ width: `${bossHealth}%` }}
            style={{ backgroundColor: bossHealth > 50 ? '#4caf50' : '#f44336' }}
          />
        </div>
      </div>

      <div className="duel-arena">
        {/* Phase 1: Mirror Reflection */}
        {phase === 1 && (
          <motion.div 
            key="phase1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="duel-phase"
          >
            <div className="phase-instruction">{duel.phase1.clue}</div>
            
            <div className="mirror-duel">
              <div className="target-rune-box">
                <div className="box-label">Quirrell's Spell:</div>
                <Rune rotation={duel.phase1.target.rotation} dots={duel.phase1.target.dots} />
              </div>
              <div className="reflection-icon">⚡</div>
              <div className="options-row-boss">
                {duel.phase1.options.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePhase1Select(opt)}
                    className={`boss-option-btn ${status === 'error' ? 'shake' : ''}`}
                  >
                    <Rune rotation={opt.rotation} dots={opt.dots} />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Stone Deduction */}
        {phase === 2 && (
          <motion.div 
            key="phase2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="duel-phase"
          >
            <div className="phase-instruction">{duel.phase2.clue}</div>
            
            <div className="pedestals-row">
              {duel.phase2.options.map((opt) => (
                <motion.div
                  key={opt.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePhase2Select(opt)}
                  className={`pedestal ${selectedId === opt.id ? 'selected' : ''} ${status === 'error' && selectedId === opt.id ? 'poison' : ''}`}
                >
                  <div className="pedestal-stone" />
                  <div className="pedestal-base" />
                  <div className="pedestal-label">{opt.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="duel-feedback error"
          >
            {phase === 1 ? "The spell breaks through! Try another reflection." : duel.phase2.failureMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
