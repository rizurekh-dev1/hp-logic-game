/**
 * levels.js — Single source of truth for all game level content.
 *
 * To add a new level:
 *   1. Create a new folder: public/assets/levels/level-XX-<name>/
 *   2. Drop in puzzle-image.png and intro-background.jpg
 *   3. Add a new entry to this array below.
 *   Zero changes needed anywhere else in the codebase.
 */

export const LEVELS = [
  {
    id: 1,
    slug: 'level-01-devils-snare',
    type: 'JIGSAW',
    title: "The Devil's Snare",
    subtitle: "Harry needs your help!",
    narrative:
      "Harry, Ron and Hermione have fallen through a trapdoor and are being strangled by Devil's Snare. " +
      "Hermione knows the spell to stop it — but the incantation is hidden in a shattered magical portrait. " +
      "Reassemble the portrait to reveal the spell and save them!",
    completionWord: 'LUMOS SOLEM',
    completionMessage: "You remembered the spell! Harry, Ron and Hermione are free. Dumbledore would be proud.",
    grid: { rows: 3, cols: 3 },
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },

  {
    id: 2,
    slug: 'level-02-flying-keys',
    type: 'MATH_CHALLENGE',
    title: "The Flying Keys",
    subtitle: "Logic & Calculation",
    narrative:
      "To open the door, Harry needs to find the correct silver key. " +
      "The Professor has enchanted the keys with a mathematical lock! " +
      "Solve the riddle to identify the silver key and move forward.",
    problem: {
      text: "At the magical shop, 5 Brooms cost $50. If you buy 2 Brooms and 1 Silver Key together, it costs $35. What is the difference in price between 1 Broom and 1 Silver Key?",
      solution: 5,
      items: {
        broom: { icon: '🧹', value: 10 },
        key: { icon: '🔑', value: 15 }
      }
    },
    completionWord: 'ALOHOMORA',
    completionMessage: "The Silver Key turns in the lock! You've outsmarted the Professor's enchantment.",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png', // Fallback or background
    },
  },
];
