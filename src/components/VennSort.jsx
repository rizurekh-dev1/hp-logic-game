import { useState } from 'react';
import { motion } from 'framer-motion';
import { trackEvent } from '../analytics';
import './VennSort.css';

export function VennSort({ level, onComplete }) {
  const { venn } = level;
  const [placed, setPlaced] = useState({});
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle');

  const trayItems = venn.items.filter(item => !placed[item.id]);

  const zoneMap = { gold: 'circleA', flies: 'circleB', both: 'both', neither: 'outside' };

  const handleItemClick = (itemId) => {
    if (status === 'success') return;
    setSelected(itemId === selected ? null : itemId);
  };

  const handleZoneClick = (zone) => {
    if (status === 'success' || !selected) return;
    setPlaced(prev => ({ ...prev, [selected]: zone }));
    setSelected(null);
    trackEvent('venn_item_placed', { level: level.id, item: selected, zone });
  };

  const handlePlacedClick = (itemId) => {
    if (status === 'success') return;
    const newPlaced = { ...placed };
    delete newPlaced[itemId];
    setPlaced(newPlaced);
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
        return (
          <div key={id} className="placed-item" onClick={() => handlePlacedClick(id)}>
            <span className="placed-emoji">{item.emoji}</span>
          </div>
        );
      })
  );

  return (
    <div className="venn-sort">
      <div className="venn-container">
        <div className="venn-circles">
          <div className="venn-circle circle-a" />
          <div className="venn-circle circle-b" />
        </div>
        <div className="venn-zones">
          <div className="venn-zone zone-left" onClick={() => handleZoneClick('circleA')}>
            <div className="zone-label-inner">{venn.circleA.label}</div>
            {renderZoneItems('circleA')}
          </div>
          <div className="venn-zone zone-center" onClick={() => handleZoneClick('both')}>
            <div className="zone-label-inner">Both</div>
            {renderZoneItems('both')}
          </div>
          <div className="venn-zone zone-right" onClick={() => handleZoneClick('circleB')}>
            <div className="zone-label-inner">{venn.circleB.label}</div>
            {renderZoneItems('circleB')}
          </div>
        </div>
        <div className="venn-outside" onClick={() => handleZoneClick('outside')}>
          <div className="zone-label-inner">Neither</div>
          {renderZoneItems('outside')}
        </div>
      </div>

      <div className="item-tray">
        <p className="tray-hint">Tap an item, then tap where it belongs</p>
        <div className="tray-items">
          {trayItems.map(item => (
            <motion.div
              key={item.id}
              layout
              className={`tray-item ${selected === item.id ? 'selected' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="tray-emoji">{item.emoji}</span>
              <span className="tray-label">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <button
        className={`magic-button ${venn.items.every(item => placed[item.id]) ? '' : 'disabled'}`}
        onClick={handleSubmit}
      >
        Check Sorting
      </button>

      {status === 'error' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="feedback-error">
          Not quite right! Items reset — try again!
        </motion.p>
      )}
      {status === 'success' && (
        <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="feedback-success">
          🎉 Perfect sorting! Filly is delighted! 🎉
        </motion.p>
      )}
    </div>
  );
}
