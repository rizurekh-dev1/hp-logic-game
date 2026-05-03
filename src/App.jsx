import { useReducer, useEffect } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';

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
  totalLevels: 1, // Start with 1 puzzle
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

  // Simulate asset preloading
  useEffect(() => {
    if (state.currentState === GAME_STATES.INITIAL_LOAD) {
      const timer = setTimeout(() => {
        dispatch({ type: 'ASSETS_LOADED' });
      }, 1500); // Faux loading for now
      return () => clearTimeout(timer);
    }
  }, [state.currentState]);

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
            onClick={() => dispatch({ type: 'START_GAME' })}
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
              onClick={() => dispatch({ type: 'START_PUZZLE' })}
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
          >
            <h2 className="magic-text">The Devil's Snare</h2>
            <div style={{ width: 'min(90vw, 400px)', aspectRatio: '1/1', border: '2px dashed var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
              <p>Jigsaw Puzzle Goes Here</p>
            </div>
            <button 
              style={{ padding: '10px 20px', fontSize: '18px', background: 'var(--accent-gold)', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 'bold' }}
              onClick={() => dispatch({ type: 'PUZZLE_SOLVED' })}
            >
              Simulate Win
            </button>
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
            <p>You saved Ron and Hermione.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
