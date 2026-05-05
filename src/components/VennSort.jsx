import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '../analytics';
import './VennSort.css';

export function VennSort({ level, onComplete }) {
  const { venn } = level;
  const [placed, setPlaced] = useState({});
  const [dragState, setDragState] = useState(null);
  const [hoverZone, setHoverZone] = useState(null);
  const [status, setStatus] = useState('idle');
  const dragRef = useRef(null);
  const containerRef = useRef(null);

  const trayItems = venn.items.filter(item => !placed[item.id]);
  const zoneMap = { gold: 'circleA', flies: 'circleB', both: 'both', neither: 'outside' };

  const getZoneAt = useCallback((clientX, clientY) => {
    const zones = containerRef.current?.querySelectorAll('[data-zone]');
    if (!zones) return null;
    for (const el of zones) {
      const rect = el.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right &&
          clientY >= rect.top && clientY <= rect.bottom) {
        return el.getAttribute('data-zone');
      }
    }
    return null;
  }, []);

  const handlePointerDown = (e, itemId) => {
    if (status === 'success') return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const state = {
      id: itemId,
      x: e.clientX,
      y: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    dragRef.current = state;
    setDragState(state);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    dragRef.current = { ...dragRef.current, x, y };
    setDragState(prev => prev ? { ...prev, x, y } : null);
    setHoverZone(getZoneAt(x, y));
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;
    const zone = getZoneAt(e.clientX, e.clientY);
    if (zone === 'tray') {
      const newPlaced = { ...placed };
      delete newPlaced[dragRef.current.id];
      setPlaced(newPlaced);
    } else if (zone && zone !== 'tray') {
      setPlaced(prev => ({ ...prev, [dragRef.current.id]: zone }));
      trackEvent('venn_item_placed', { level: level.id, item: dragRef.current.id, zone });
    }
    dragRef.current = null;
    setDragState(null);
    setHoverZone(null);
  };

  const handleSubmit = () => {
    const allPlaced = venn.items.every(item => placed[item.id]);
    if (!allPlaced) return;
    const correct = venn.items.every(item => placed[item.id] === zoneMap[item.zone]);
    trackEvent('venn_submitted', { level: level.id, correct });
    if (correct) {
      setStatus('success');
      trackEvent(`level_${level.id}_venn_success`);
      setTimeout(onComplete, 1800);
    } else {
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setPlaced({});
      }, 1000);
    }
  };

  const renderZoneItems = (zone) => (
    Object.entries(placed)
      .filter(([, z]) => z === zone)
      .map(([id]) => {
        const item = venn.items.find(i => i.id === id);
        if (!item) return null;
        const isDragging = dragState?.id === id;
        return (
          <div
            key={id}
            className={`placed-item ${isDragging ? 'dragging' : ''}`}
            onPointerDown={(e) => handlePointerDown(e, id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ touchAction: 'none' }}
          >
            <span className="placed-emoji">{item.emoji}</span>
          </div>
        );
      })
  );

  return (
    <div className="venn-sort" ref={containerRef}>
      <div className="venn-container">
        <div className="venn-circles">
          <div className="venn-circle circle-a" />
          <div className="venn-circle circle-b" />
        </div>
        <div className="venn-zones">
          <div className={`venn-zone zone-left ${hoverZone === 'circleA' ? 'zone-hover' : ''}`} data-zone="circleA">
            <div className="zone-label-inner">{venn.circleA.label}</div>
            {renderZoneItems('circleA')}
          </div>
          <div className={`venn-zone zone-center ${hoverZone === 'both' ? 'zone-hover' : ''}`} data-zone="both">
            <div className="zone-label-inner">Both</div>
            {renderZoneItems('both')}
          </div>
          <div className={`venn-zone zone-right ${hoverZone === 'circleB' ? 'zone-hover' : ''}`} data-zone="circleB">
            <div className="zone-label-inner">{venn.circleB.label}</div>
            {renderZoneItems('circleB')}
          </div>
        </div>
        <div className={`venn-outside ${hoverZone === 'outside' ? 'zone-hover' : ''}`} data-zone="outside">
          <div className="zone-label-inner">Neither</div>
          {renderZoneItems('outside')}
        </div>
      </div>

      <div className="item-tray" data-zone="tray">
        <p className="tray-hint">Drag each item into the right zone</p>
        <div className="tray-items">
          {trayItems.map(item => {
            const isDragging = dragState?.id === item.id;
            return (
              <div
                key={item.id}
                className={`tray-item ${isDragging ? 'dragging' : ''}`}
                onPointerDown={(e) => handlePointerDown(e, item.id)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ touchAction: 'none' }}
              >
                <span className="tray-emoji">{item.emoji}</span>
                <span className="tray-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        className={`magic-button ${venn.items.every(item => placed[item.id]) ? '' : 'disabled'}`}
        onClick={handleSubmit}
      >
        Check Sorting
      </button>

      {dragState && (
        <div
          className="drag-ghost"
          style={{
            position: 'fixed',
            left: dragState.x - dragState.offsetX,
            top: dragState.y - dragState.offsetY,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {(() => {
            const item = venn.items.find(i => i.id === dragState.id);
            return item ? (
              <>
                <span className="ghost-emoji">{item.emoji}</span>
                <span className="ghost-label">{item.label}</span>
              </>
            ) : null;
          })()}
        </div>
      )}

      {status === 'error' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="feedback-error">
          Not quite right! Items reset — try again!
        </motion.p>
      )}
      {status === 'success' && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="feedback-success">
          Perfect sorting! Filly is delighted!
        </motion.p>
      )}
    </div>
  );
}
