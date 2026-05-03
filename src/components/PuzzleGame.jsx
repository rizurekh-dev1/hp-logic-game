import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '../analytics';
import './PuzzleGame.css';

/**
 * Generates shuffled piece data using Fisher-Yates for perfect randomness.
 */
function initPieces(grid) {
  const pieces = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      pieces.push({
        id: row * grid.cols + col,
        correctRow: row,
        correctCol: col,
        isPlaced: false,
      });
    }
  }
  
  // Fisher-Yates Shuffle
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}

/**
 * Loads puzzle state from localStorage with validation.
 */
function loadSavedState(levelId, grid) {
  try {
    const saved = localStorage.getItem(`puzzle-state-level-${levelId}`);
    if (saved) {
      const data = JSON.parse(saved);
      // Validate that the saved grid matches the current level config
      const expectedTotal = grid.rows * grid.cols;
      if (data.pieces?.length === expectedTotal) {
        return data;
      }
    }
  } catch (_) { /* ignore */ }
  return { pieces: initPieces(grid), slotContents: {}, correctCount: 0 };
}

export function PuzzleGame({ level, onComplete }) {
  const COLS = level.grid.cols;
  const ROWS = level.grid.rows;
  const TOTAL = ROWS * COLS;

  // ── Responsive Sizing ───────────────────────────────────────────────────
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PIECE_SIZE = Math.floor(Math.min(windowWidth * 0.9, 360) / COLS);

  // ── State ────────────────────────────────────────────────────────────────
  const [pieces, setPieces] = useState(() => loadSavedState(level.id, level.grid).pieces);
  const [slotContents, setSlotContents] = useState(() => loadSavedState(level.id, level.grid).slotContents);
  const [correctCount, setCorrectCount] = useState(() => loadSavedState(level.id, level.grid).correctCount);
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [wrongSlotKey, setWrongSlotKey] = useState(null); 

  // Reset state if level changes
  useEffect(() => {
    const fresh = loadSavedState(level.id, level.grid);
    setPieces(fresh.pieces);
    setSlotContents(fresh.slotContents);
    setCorrectCount(fresh.correctCount);
    setSelectedPieceId(null);
  }, [level.id, level.grid]);

  // ── Persistence ──────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(
      `puzzle-state-level-${level.id}`,
      JSON.stringify({ pieces, slotContents, correctCount })
    );
  }, [pieces, slotContents, correctCount, level.id]);

  // ── Win condition ────────────────────────────────────────────────────────
  useEffect(() => {
    if (correctCount === TOTAL) {
      localStorage.removeItem(`puzzle-state-level-${level.id}`);
      setTimeout(onComplete, 600); 
    }
  }, [correctCount, TOTAL, onComplete, level.id]);

  // ── Core placement logic ─────────────────────────────────────────────────
  function placePiece(pieceId, slotRow, slotCol) {
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece || piece.isPlaced) return;

    const slotKey = `${slotRow}-${slotCol}`;
    if (slotContents[slotKey] !== undefined) return;

    const isCorrect = piece.correctRow === slotRow && piece.correctCol === slotCol;

    if (isCorrect) {
      setSlotContents(prev => ({ ...prev, [slotKey]: pieceId }));
      setPieces(prev => prev.map(p => p.id === pieceId ? { ...p, isPlaced: true } : p));
      setSelectedPieceId(null);
      setCorrectCount(prev => prev + 1);
      trackEvent('piece_placed', { level: level.id, piece: pieceId });
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      setWrongSlotKey(slotKey);
      setTimeout(() => setWrongSlotKey(null), 500);
      if (navigator.vibrate) navigator.vibrate([40, 20, 40]);
    }
  }

  function handleSlotTap(slotRow, slotCol) {
    if (selectedPieceId !== null) {
      placePiece(selectedPieceId, slotRow, slotCol);
    }
  }

  function handleDragEnd(event, info, piece) {
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Magnetic detection: find the closest slot center
    let closestSlot = null;
    let minDistance = PIECE_SIZE * 0.6; // Adaptive magnetic reach based on grid size

    const slotElements = document.querySelectorAll('[data-slot]');
    slotElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dist = Math.sqrt(
        Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2)
      );

      if (dist < minDistance) {
        minDistance = dist;
        closestSlot = el.dataset.slot;
      }
    });

    if (closestSlot) {
      const [slotRow, slotCol] = closestSlot.split('-').map(Number);
      placePiece(piece.id, slotRow, slotCol);
    }
  }

  const unplacedPieces = pieces.filter(p => !p.isPlaced);

  return (
    <div className="puzzle-game">
      <div className="puzzle-progress-bar">
        <div
          className="puzzle-progress-fill"
          style={{ width: `${(correctCount / TOTAL) * 100}%` }}
        />
      </div>
      
      <div className="puzzle-header-row">
        <p className="puzzle-progress-text">{correctCount} of {TOTAL} pieces</p>
      </div>

      <div
        className="puzzle-board"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${PIECE_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${PIECE_SIZE}px)`,
        }}
      >
        {/* The Ghost Guide */}
        <div 
          className="puzzle-board-ghost" 
          style={{ backgroundImage: `url(${level.assets.puzzleImage})` }} 
        />

        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const key = `${row}-${col}`;
            const placedPieceId = slotContents[key];
            const isWrong = wrongSlotKey === key;
            const isSelected = selectedPieceId !== null;

            return (
              <div
                key={key}
                data-slot={key}
                className={`puzzle-slot ${placedPieceId !== undefined ? 'slot-placed' : ''} ${isWrong ? 'slot-wrong' : ''} ${isSelected && placedPieceId === undefined ? 'slot-targetable' : ''}`}
                style={{ width: PIECE_SIZE, height: PIECE_SIZE }}
                onClick={() => handleSlotTap(row, col)}
              >
                {placedPieceId !== undefined && (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="piece-in-slot"
                    style={{
                      width: PIECE_SIZE,
                      height: PIECE_SIZE,
                      backgroundImage: `url(${level.assets.puzzleImage})`,
                      backgroundSize: `${PIECE_SIZE * COLS}px ${PIECE_SIZE * ROWS}px`,
                      backgroundPosition: `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`,
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="puzzle-hint">
        {selectedPieceId !== null
          ? '✨ Tap an empty slot to place the piece'
          : 'Drag a piece or tap it to select'}
      </p>

      <div className="puzzle-tray">
        {unplacedPieces.map(piece => (
          <motion.div
            key={piece.id}
            className={`puzzle-piece ${selectedPieceId === piece.id ? 'piece-selected' : ''}`}
            drag
            dragMomentum={false}
            dragSnapToOrigin={true}
            whileDrag={{ 
              scale: 1.08, 
              zIndex: 200, 
              boxShadow: '0 12px 32px rgba(0,229,255,0.4)',
              pointerEvents: 'none' // Crucial for elementFromPoint to see through the piece
            }}
            whileTap={{ scale: 0.93 }}
            onDragEnd={(e, info) => handleDragEnd(e, info, piece)}
            onClick={() => setSelectedPieceId(prev => prev === piece.id ? null : piece.id)}
            style={{
              width: PIECE_SIZE,
              height: PIECE_SIZE,
              backgroundImage: `url(${level.assets.puzzleImage})`,
              backgroundSize: `${PIECE_SIZE * COLS}px ${PIECE_SIZE * ROWS}px`,
              backgroundPosition: `-${piece.correctCol * PIECE_SIZE}px -${piece.correctRow * PIECE_SIZE}px`,
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
