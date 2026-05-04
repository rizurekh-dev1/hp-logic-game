import { useReducer, useEffect, useState } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from './analytics.js';
import { PuzzleGame } from './components/PuzzleGame.jsx';
import { MathChallenge } from './components/MathChallenge.jsx';
import { PotionRiddle } from './components/PotionRiddle.jsx';
import { PatternMatch } from './components/PatternMatch.jsx';
import { BossDuel } from './components/BossDuel.jsx';
import { StoryDialogue } from './components/StoryDialogue.jsx';
import { LEVELS } from './config/levels.js';
import { STORYLINE } from './config/storyline.js';

const GAME_STATES = {
  INITIAL_LOAD: 'INITIAL_LOAD',
  TAP_TO_START: 'TAP_TO_START',
  STORY_SEQUENCE: 'STORY_SEQUENCE',
  LEVEL_INTRO: 'LEVEL_INTRO',
  CHALLENGE_ACTIVE: 'CHALLENGE_ACTIVE',
  LEVEL_SUCCESS: 'LEVEL_SUCCESS',
  NEXT_LEVEL_TRANSITION: 'NEXT_LEVEL_TRANSITION',
  GAME_COMPLETE: 'GAME_COMPLETE',
};

const getStartingLevel = () => {
  const params = new URLSearchParams(window.location.search);
  const lvl = parseInt(params.get('level'));
  if (!isNaN(lvl) && lvl > 0 && lvl <= LEVELS.length) {
    return lvl - 1;
  }
  return 0;
};

const initialState = {
  currentState: GAME_STATES.INITIAL_LOAD,
  currentLevelIndex: getStartingLevel(),
  totalLevels: LEVELS.length,
  unlockedLevels: 0,
  storyQueue: null,
  storyTarget: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'ASSETS_LOADED':
      return { ...state, currentState: GAME_STATES.TAP_TO_START };
    case 'START_GAME':
      return {
        ...state,
        currentState: GAME_STATES.STORY_SEQUENCE,
        storyQueue: STORYLINE.prologue,
        storyTarget: GAME_STATES.LEVEL_INTRO,
      };
    case 'START_CHALLENGE':
      return { ...state, currentState: GAME_STATES.CHALLENGE_ACTIVE };
    case 'LEVEL_SOLVED':
      return { ...state, currentState: GAME_STATES.LEVEL_SUCCESS };
    case 'NEXT_LEVEL':
      if (state.currentLevelIndex + 1 >= state.totalLevels) return state;
      return {
        ...state,
        currentState: GAME_STATES.NEXT_LEVEL_TRANSITION,
        currentLevelIndex: state.currentLevelIndex + 1,
      };
    case 'TRANSITION_COMPLETE': {
      const prevStory = STORYLINE.levels[state.currentLevelIndex];
      const nextStory = STORYLINE.levels[state.currentLevelIndex + 1];
      const queue = [
        ...(prevStory?.outro || []),
        ...(nextStory?.intro || []),
      ];
      return {
        ...state,
        currentState: GAME_STATES.STORY_SEQUENCE,
        storyQueue: queue.length > 0 ? queue : null,
        storyTarget: GAME_STATES.LEVEL_INTRO,
      };
    }
    case 'SHOW_EPILOGUE':
      return {
        ...state,
        currentState: GAME_STATES.STORY_SEQUENCE,
        storyQueue: STORYLINE.epilogue,
        storyTarget: GAME_STATES.GAME_COMPLETE,
      };
    case 'STORY_COMPLETE':
      return {
        ...state,
        currentState: state.storyTarget || GAME_STATES.LEVEL_INTRO,
        storyQueue: null,
        storyTarget: null,
      };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sparks, setSparks] = useState(0);

  const currentLevel = LEVELS[state.currentLevelIndex] || LEVELS[0];
  const isLastLevel = state.currentLevelIndex + 1 === state.totalLevels;

  useEffect(() => {
    trackEvent('game_state_changed', {
      state: state.currentState,
      level: state.currentLevelIndex + 1,
      type: currentLevel.type,
    });
  }, [state.currentState, state.currentLevelIndex]);

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

  useEffect(() => {
    if (state.currentState === GAME_STATES.INITIAL_LOAD || state.currentState === GAME_STATES.NEXT_LEVEL_TRANSITION) {
      if (!currentLevel.assets.puzzleImage) {
        dispatch({ type: state.currentState === GAME_STATES.INITIAL_LOAD ? 'ASSETS_LOADED' : 'TRANSITION_COMPLETE' });
        return;
      }

      const img = new Image();
      img.src = currentLevel.assets.puzzleImage;

      const onLoaded = () => {
        setTimeout(() => {
          if (state.currentState === GAME_STATES.INITIAL_LOAD) {
            const isDebug = new URLSearchParams(window.location.search).has('level');
            if (isDebug) {
              dispatch({ type: 'START_GAME' });
            } else {
              dispatch({ type: 'ASSETS_LOADED' });
            }
          } else {
            dispatch({ type: 'TRANSITION_COMPLETE' });
          }
        }, 800);
      };

      img.onload = onLoaded;
      img.onerror = onLoaded;
    }
  }, [state.currentState, currentLevel.assets.puzzleImage]);

  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && state.currentState === GAME_STATES.CHALLENGE_ACTIVE) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) { console.warn('Wake Lock error:', err); }
      }
    };
    requestWakeLock();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') requestWakeLock();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, [state.currentState]);

  const handleLevelSolved = () => {
    const eventName = `level_${state.currentLevelIndex + 1}_${currentLevel.type.toLowerCase()}_success`;
    trackEvent(eventName, {
      level: state.currentLevelIndex + 1,
      type: currentLevel.type,
    });
    dispatch({ type: 'LEVEL_SOLVED' });
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {!isOnline ? (
          <motion.div
            key="offline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="screen"
            onClick={() => setSparks(s => s + 1)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <h1 className="magic-text" style={{ color: '#ff4444' }}>The Floo Network is Down!</h1>
            <p>It seems your magical connection has dropped.</p>
            <div style={{ margin: '40px 0', fontSize: '64px' }}>🔥</div>
            <p style={{ color: 'var(--accent-gold)' }}>Tap the screen to cast sparks while we wait!</p>
            <p className="magic-text" style={{ fontSize: '24px', marginTop: '20px' }}>Sparks cast: {sparks}</p>
          </motion.div>
        ) : (
          <>
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

            {state.currentState === GAME_STATES.NEXT_LEVEL_TRANSITION && (
              <motion.div
                key="transitioning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="screen"
              >
                <h1 className="magic-text">Traveling to {currentLevel.title}...</h1>
              </motion.div>
            )}

            {state.currentState === GAME_STATES.STORY_SEQUENCE && state.storyQueue && (
              <StoryDialogue
                key="story"
                queue={state.storyQueue}
                onComplete={() => dispatch({ type: 'STORY_COMPLETE' })}
              />
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
                <p style={{ maxWidth: '360px', lineHeight: 1.6 }}>{currentLevel.narrative}</p>
                <button
                  className="magic-button"
                  onClick={() => dispatch({ type: 'START_CHALLENGE' })}
                >
                  Enter the Challenge
                </button>
              </motion.div>
            )}

            {state.currentState === GAME_STATES.CHALLENGE_ACTIVE && (
              <motion.div
                key="challenge"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="screen"
                style={{ justifyContent: 'flex-start', paddingTop: '10px' }}
              >
                <h2 className="magic-text" style={{ fontSize: '18px', marginBottom: '6px' }}>
                  {currentLevel.title}
                </h2>

                {currentLevel.type === 'JIGSAW' && (
                  <PuzzleGame
                    level={currentLevel}
                    onComplete={handleLevelSolved}
                  />
                )}

                {currentLevel.type === 'MATH_CHALLENGE' && (
                  <MathChallenge
                    level={currentLevel}
                    onComplete={handleLevelSolved}
                  />
                )}

                {currentLevel.type === 'POTION_RIDDLE' && (
                  <PotionRiddle
                    level={currentLevel}
                    onComplete={handleLevelSolved}
                  />
                )}

                {currentLevel.type === 'PATTERN_MATCH' && (
                  <PatternMatch
                    level={currentLevel}
                    onComplete={handleLevelSolved}
                  />
                )}

                {currentLevel.type === 'BOSS_DUEL' && (
                  <BossDuel
                    level={currentLevel}
                    onComplete={handleLevelSolved}
                  />
                )}
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
                <p>{currentLevel.completionMessage}</p>
                <p className="completion-word">
                  {currentLevel.completionWord}
                </p>
                {!isLastLevel ? (
                  <button
                    className="magic-button"
                    style={{ marginTop: '30px' }}
                    onClick={() => dispatch({ type: 'NEXT_LEVEL' })}
                  >
                    Next Level
                  </button>
                ) : (
                  <button
                    className="magic-button"
                    style={{ marginTop: '30px' }}
                    onClick={() => dispatch({ type: 'SHOW_EPILOGUE' })}
                  >
                    See the Ending
                  </button>
                )}
              </motion.div>
            )}

            {state.currentState === GAME_STATES.GAME_COMPLETE && (
              <motion.div
                key="game-complete"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="screen"
              >
                <h1 className="magic-text" style={{ color: 'var(--accent-gold)' }}>The End</h1>
                <p style={{ marginTop: '20px', maxWidth: '360px', lineHeight: 1.6 }}>
                  You have completed your first year at Hogwarts. The Philosopher's Stone is safe, thanks to your logic and bravery.
                </p>
                <div style={{ margin: '30px 0', fontSize: '48px' }}>🏆</div>
                <p className="magic-text" style={{ color: 'var(--accent-gold)', fontSize: '20px' }}>
                  More adventures await...
                </p>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
