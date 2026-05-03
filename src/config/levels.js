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
      visualHints: [
        { type: 'equation', content: '🧹🧹🧹🧹🧹 = $50' },
        { type: 'equation', content: '🧹🧹 + 🔑 = $35' }
      ],
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

  {
    id: 3,
    slug: 'level-03-potions-riddle',
    type: 'POTION_RIDDLE',
    title: "Snape's Potion Riddle",
    subtitle: "Deduction & Fire",
    narrative:
      "A wall of black fire blocks the way! You must choose the correct potion to live and pass through the flames. " +
      "Choose wrongly, and you shall be trapped here forever! Use your logic to survive.",
    riddle: {
      clues: [
        "1. Imagine 5 bottles in a line on a stone shelf.",
        "2. The Purple bottle is at the very end of the line (far right).",
        "3. The Safe Potion is the one exactly in the middle of the line.",
        "4. The Red bottle is poison—it sits directly next to the Purple one.",
        "5. The Blue and Green bottles sit next to each other at the other end.",
        "6. The Yellow bottle is the only one left!"
      ],
      bottles: [
        { id: 'red', color: '#ff4444', label: 'Option A' },
        { id: 'blue', color: '#00e5ff', label: 'Option B' },
        { id: 'green', color: '#00ff88', label: 'Option C' },
        { id: 'purple', color: '#a020f0', label: 'Option D' },
        { id: 'yellow', color: '#ffd700', label: 'Option E' }
      ],
      solution: 'yellow',
      failureMessage: "💀 The flames consume you! That was the wrong potion. Luckily, time turns back... Try again!"
    },
    completionWord: 'PROTEGO',
    completionMessage: "The flames part as you drink the Yellow potion! Your logic is as sharp as Hermione's.",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },

  {
    id: 4,
    slug: 'level-04-mirror-erised',
    type: 'PATTERN_MATCH',
    title: "The Mirror of Erised",
    subtitle: "Runic Reflection",
    narrative:
      "The mirror does not show your face, but the logic of the ancient runes. " +
      "Find the missing piece of the pattern to reveal the Philosopher's Stone!",
    pattern: {
      sequence: [
        { rotation: 0, dots: 1 },
        { rotation: 90, dots: 2 },
        { rotation: 180, dots: 3 }
      ],
      options: [
        { id: 'opt-1', rotation: 270, dots: 4, isCorrect: true },
        { id: 'opt-2', rotation: 270, dots: 3, isCorrect: false },
        { id: 'opt-3', rotation: 90, dots: 4, isCorrect: false },
        { id: 'opt-4', rotation: 0, dots: 5, isCorrect: false }
      ],
      failureMessage: "The mirror remains clouded. That is not the true reflection of the pattern.",
      hint: "Look at the direction of the triangle and count the dots carefully!"
    },
    completionWord: 'ALOHOMORA',
    completionMessage: "The Mirror shimmers and the Stone appears in your pocket! You have mastered the patterns of magic.",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },
];
