import { useReducer, useEffect, useState } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from './analytics.js';
import { PuzzleGame } from './components/PuzzleGame.jsx';
import { LEVELS } from './config/levels.js';

const GAME_STATES = {
  INITIAL_LOAD: 'INITIAL_LOAD',
  TAP_TO_START: 'TAP_TO_START',
  LEVEL_INTRO: 'LEVEL_INTRO',
  PUZZLE_ACTIVE: 'PUZZLE_ACTIVE',
  LEVEL_SUCCESS: 'LEVEL_SUCCESS',
  NEXT_LEVEL_TRANSITION: 'NEXT_LEVEL_TRANSITION'
};

const initialState = {
  currentState: GAME_STATES.INITIAL_LOAD,
  currentLevelIndex: 0,
  totalLevels: 1, // Start with 1 puzzle — increment as we add more
  unlockedLevels: 0,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'ASSETS_LOADED':
      return { ...state, currentState: GAME_STATES.TAP_TO_START };
    case 'START_GAME':
      return { ...state, currentState: GAME_STATES.LEVEL_INTRO };
    case 'START_PUZZLE':
      return { ...state, currentState: GAME_STATES.PUZZLE_ACTIVE };
    case 'PUZZLE_SOLVED':
      return { ...state, currentState: GAME_STATES.LEVEL_SUCCESS };
    case 'NEXT_LEVEL':
      return {
        ...state,
        currentState: GAME_STATES.NEXT_LEVEL_TRANSITION,
        currentLevelIndex: state.currentLevelIndex + 1
      };
    case 'TRANSITION_COMPLETE':
      return { ...state, currentState: GAME_STATES.LEVEL_INTRO };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sparks, setSparks] = useState(0); // for the offline mini-game

  // Track every state transition automatically
  useEffect(() => {
    trackEvent('game_state_changed', {
      state: state.currentState,
      level: state.currentLevelIndex + 1,
    });
  }, [state.currentState, state.currentLevelIndex]);

  // Online/Offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Actual asset preloading
  useEffect(() => {
    if (state.currentState === GAME_STATES.INITIAL_LOAD) {
      const currentLevel = LEVELS[state.currentLevelIndex];
      const img = new Image();
      img.src = currentLevel.assets.puzzleImage;
      
      const onLoaded = () => {
        // Add a small 800ms purposeful delay so the intro doesn't instantly flash by
        setTimeout(() => dispatch({ type: 'ASSETS_LOADED' }), 800);
      };
      
      img.onload = onLoaded;
      img.onerror = onLoaded; // Fallback so the game doesn't hang if image fails
    }
  }, [state.currentState, state.currentLevelIndex]);

  // ── Screen Wake Lock API ─────────────────────────────────────────────────
  useEffect(() => {
    let wakeLock = null;

    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && state.currentState === GAME_STATES.PUZZLE_ACTIVE) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.warn('Wake Lock error:', err);
        }
      }
    };

    requestWakeLock();

    // The wake lock is released automatically when the tab becomes hidden.
    // We must re-request it when the user tabs back in.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [state.currentState]);

  const handleTapToStart = () => {
    trackEvent('tap_to_start', { level: state.currentLevelIndex + 1 });
    dispatch({ type: 'START_GAME' });
  };

  const handleEnterChallenge = () => {
    trackEvent('puzzle_started', { level: state.currentLevelIndex + 1 });
    dispatch({ type: 'START_PUZZLE' });
  };

  const handlePuzzleSolved = () => {
    trackEvent('puzzle_solved', { level: state.currentLevelIndex + 1 });
    dispatch({ type: 'PUZZLE_SOLVED' });
  };

  // ── Offline Screen (The "Floo Network" Mini-game) ──────────────────────
  if (!isOnline) {
    return (
      <div className="app-container">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="screen"
          onClick={() => setSparks(s => s + 1)}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <h1 className="magic-text" style={{ color: '#ff4444' }}>The Floo Network is Down!</h1>
          <p>It seems your magical connection has dropped.</p>
          <div style={{ margin: '40px 0', fontSize: '64px' }}>
            🔥
          </div>
          <p style={{ color: 'var(--accent-gold)' }}>Tap the screen to cast sparks while we wait!</p>
          <p className="magic-text" style={{ fontSize: '24px', marginTop: '20px' }}>Sparks cast: {sparks}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {state.currentState === GAME_STATES.INITIAL_LOAD && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="screen"
          >
            <h1 className="magic-text">Mischief Managed...</h1>
            <p>Loading magical assets...</p>
          </motion.div>
        )}

        {state.currentState === GAME_STATES.TAP_TO_START && (
          <motion.div
            key="tap-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="screen"
            onClick={handleTapToStart}
            style={{ cursor: 'pointer' }}
          >
            <h1 className="magic-text" style={{ color: 'var(--accent-gold)' }}>Tap to Open</h1>
            <p>Your Hogwarts Letter Awaits</p>
          </motion.div>
        )}

        {state.currentState === GAME_STATES.LEVEL_INTRO && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="screen"
          >
            <h2 className="magic-text">Level {state.currentLevelIndex + 1}</h2>
            <p>Harry needs your help!</p>
            <button
              style={{ marginTop: '20px', padding: '10px 20px', fontSize: '18px', background: 'var(--accent-blue)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 'bold' }}
              onClick={handleEnterChallenge}
            >
              Enter the Challenge
            </button>
          </motion.div>
        )}

        {state.currentState === GAME_STATES.PUZZLE_ACTIVE && (
          <motion.div
            key="puzzle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="screen"
            style={{ justifyContent: 'flex-start', paddingTop: '10px' }}
          >
            <h2 className="magic-text" style={{ fontSize: '18px', marginBottom: '6px' }}>
              {LEVELS[state.currentLevelIndex].title}
            </h2>
            <PuzzleGame
              level={LEVELS[state.currentLevelIndex]}
              onComplete={handlePuzzleSolved}
            />
          </motion.div>
        )}

        {state.currentState === GAME_STATES.LEVEL_SUCCESS && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="screen"
          >
            <h1 className="magic-text" style={{ color: 'var(--accent-blue)' }}>Brilliant!</h1>
            <p>{LEVELS[state.currentLevelIndex].completionMessage}</p>
            <p style={{ marginTop: '12px', fontSize: '22px', fontFamily: 'var(--font-magic)', color: 'var(--accent-gold)', letterSpacing: '4px' }}>
              {LEVELS[state.currentLevelIndex].completionWord}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
