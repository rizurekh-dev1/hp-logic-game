const STORAGE_KEY = 'myGame_currentLevel';

export function saveProgress(levelIndex) {
  try {
    localStorage.setItem(STORAGE_KEY, String(levelIndex));
  } catch (e) {
    console.warn('Could not save progress:', e);
  }
}

export function getSavedProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : null;
  } catch (e) {
    return null;
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear progress:', e);
  }
}
