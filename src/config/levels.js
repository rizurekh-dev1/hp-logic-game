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
      "A wall of black fire blocks the way! Three bottles stand before you. " +
      "Choose the correct one to live. Choose wrong, and you shall be trapped here forever!",
    riddle: {
      warningHeader: "⚡ CHOOSE WISELY. DEATH AWAITS THE FOOLISH. ⚡",
      clues: [
        "1. Three bottles sit in a row on the stone shelf.",
        "2. The Red bottle is on the LEFT end.",
        "3. The Green bottle is on the RIGHT end.",
        "4. Only the bottle in the MIDDLE lets you pass through the flames."
      ],
      bottles: [
        { id: 'red', color: '#ff4444', label: 'Red' },
        { id: 'blue', color: '#00e5ff', label: 'Blue' },
        { id: 'green', color: '#00ff88', label: 'Green' }
      ],
      solution: 'blue',
      failureMessage: "💀 The flames consume you! Wrong potion. Try again!"
    },
    completionWord: 'PROTEGO',
    completionMessage: "The flames part as you drink the Blue potion! Your logic is as sharp as Hermione's.",
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
  {
    id: 5,
    slug: 'level-05-boss-duel',
    type: 'BOSS_DUEL',
    title: "The Final Confrontation",
    subtitle: "Quirrell's Last Stand",
    narrative:
      "You've reached the final chamber! Professor Quirrell is trying to steal the Stone. " +
      "Use your logic to reflect his spells and find the real Stone before he does!",
    duel: {
      phase1: {
        clue: "Reflect his Rune: Pick the 90° clockwise rotation to bounce the spell back!",
        target: { rotation: 0, dots: 3 },
        options: [
          { id: 'p1-opt-1', rotation: 90, dots: 3, isCorrect: true },
          { id: 'p1-opt-2', rotation: 90, dots: 2, isCorrect: false },
          { id: 'p1-opt-3', rotation: 270, dots: 3, isCorrect: false }
        ],
        successMessage: "Excellent! The spell reflects back at Quirrell!",
        failureMessage: "The spell breaks through! You must pick the perfect reflection."
      },
      phase2: {
        clue: "The Stone is not on the left. The pedestal on the right is trapped. Where is it?",
        options: [
          { id: 'p2-left', label: 'Left Pedestal', isCorrect: false },
          { id: 'p2-middle', label: 'Middle Pedestal', isCorrect: true },
          { id: 'p2-right', label: 'Right Pedestal', isCorrect: false }
        ],
        successMessage: "You've found the true Stone!",
        failureMessage: "💀 A fake stone! The illusions are tricky. Try again!"
      }
    },
    completionWord: 'VICTORY',
    completionMessage: "Quirrell is defeated! You've secured the Philosopher's Stone and proved your mastery of logic.",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },

  {
    id: 6,
    slug: 'level-06-hogwarts-express-rescue',
    type: 'MATH_CHALLENGE',
    title: "The Hogwarts Express Rescue",
    subtitle: "Speed & Calculation",
    narrative:
      "Ron's foot is stuck in the tracks on the Great Bridge! The Hogwarts Express is barreling towards him! " +
      "Harry needs to calculate how much time he has to free Ron before the train reaches the bridge.",
    problem: {
      text: "Train Distance: 400 meters. Train Speed: 40 meters per second. How many seconds does Harry have to free Ron before the train reaches the bridge?",
      solution: 10,
      visualHints: [
        { type: 'equation', content: 'Distance ÷ Speed = Time' },
      ],
      items: {
        train: { icon: '🚂', value: 40 },
        bridge: { icon: '🌉', value: 400 }
      }
    },
    completionWord: 'EXPRESS',
    completionMessage: "Harry frees Ron just in time! The Hogwarts Express rushes past as they scramble to safety.",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },

  {
    id: 7,
    slug: 'level-07-marauders-map',
    type: 'CIPHER',
    title: "The Marauder's Map Secret",
    subtitle: "Ancient Runes Decoder",
    narrative:
      "Harry finds a blank piece of parchment. Hermione thinks it might be the Marauder's Map! " +
      "Translate the coded password using the Ancient Runes key to reveal the map.",
    cipher: {
      encrypted: '\u25B2\u25C6\u25A0\u2605\u25CF',
      solution: 'LOMSU',
      answerLength: 5,
      key: [
        { symbol: '\u25B2', letter: 'L' },
        { symbol: '\u25CF', letter: 'U' },
        { symbol: '\u25A0', letter: 'M' },
        { symbol: '\u25C6', letter: 'O' },
        { symbol: '\u2605', letter: 'S' },
      ],
    },
    completionWord: 'LOMSU',
    completionMessage: "The parchment glows with golden light! Footprints appear — the Marauder's Map is revealed!",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },

  {
    id: 8,
    slug: 'level-08-great-hall-sorting',
    type: 'VENN_SORT',
    title: "The Great Hall Sorting",
    subtitle: "Venn Diagram Logic",
    narrative:
      "Filly the House-Elf needs help sorting magical deliveries into the correct trunks! " +
      "Some items are Gold, some Fly, some are Both, and some are Neither!",
    venn: {
      circleA: { label: 'Gold', color: '#FFD700' },
      circleB: { label: 'Flies', color: '#00E5FF' },
      items: [
        { id: 'snitch', label: 'Golden Snitch', emoji: '\uD83C\uDFC6', zone: 'both', gold: true, flies: true },
        { id: 'broomstick', label: 'Firebolt Broomstick', emoji: '\uD83E\uDDF9', zone: 'flies', gold: false, flies: true },
        { id: 'coin', label: 'Galleon Coin', emoji: '\uD83E\uDE99', zone: 'gold', gold: true, flies: false },
        { id: 'socks', label: 'Wool Socks', emoji: '\uD83E\uDDE6', zone: 'neither', gold: false, flies: false },
      ],
    },
    completionWord: 'SORTED',
    completionMessage: "Every delivery is in the right trunk! Filly bows gratefully — well sorted!",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },

  {
    id: 9,
    slug: 'level-09-gringotts-vault',
    type: 'MULTIPLE_CHOICE',
    title: "Gringotts Vault Security",
    subtitle: "Balance the Scales",
    narrative:
      "A vault at Gringotts is sealed by a magical scale! " +
      "Both sides are perfectly balanced. Find the weight of one Mystery Bag to open the vault.",
    question: {
      image: '/assets/levels/balance-scale.svg',
      text: '3 Mystery Bags + 2 Gold Coins balances perfectly with 14 Gold Coins. How many coins does one Mystery Bag weigh?',
      options: [
        { id: 'A', label: '3 coins', isCorrect: false },
        { id: 'B', label: '4 coins', isCorrect: true },
        { id: 'C', label: '6 coins', isCorrect: false },
        { id: 'D', label: '8 coins', isCorrect: false },
      ],
    },
    completionWord: 'GOLD',
    completionMessage: "The vault door cranks open with a heavy metallic thud! The treasure is yours!",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },

  {
    id: 10,
    slug: 'level-10-herbology-greenhouse',
    type: 'MULTIPLE_CHOICE',
    title: "The Herbology Greenhouse",
    subtitle: "Perimeter & Area",
    narrative:
      "Professor Sprout needs to build a fence around a rare Devil's Snare patch. " +
      "Help her find the right Length and Width using the Area and Perimeter!",
    question: {
      text: 'A rectangular plot has: Area = 24 sq ft, Perimeter = 22 ft. Which Length & Width are correct?',
      options: [
        { id: 'A', label: 'Length = 8, Width = 2', isCorrect: false },
        { id: 'B', label: 'Length = 6, Width = 4', isCorrect: false },
        { id: 'C', label: 'Length = 8, Width = 3', isCorrect: true },
        { id: 'D', label: 'Length = 12, Width = 2', isCorrect: false },
      ],
    },
    completionWord: 'SPROUT',
    completionMessage: "The fence snaps into place! The Devil's Snare retreats safely inside!",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },

  {
    id: 11,
    slug: 'level-11-knight-bus',
    type: 'MATH_CHALLENGE',
    title: "The Knight Bus Squeeze",
    subtitle: "Magical Measurements",
    narrative:
      "The Knight Bus is racing toward a bridge that is only 8 meters high! " +
      "You must calculate exactly how much the bus needs to shrink so it doesn't crash.",
    problem: {
      text: 'The bus has 3 decks, and each deck is 5 meters tall. If the bridge ahead is 8 meters high, how many meters must the bus shrink to fit through?',
      solution: 7,
    },
    completionWord: 'SMASHING!',
    completionMessage: "The bus flattened itself instantly, zooming under the bridge with inches to spare!",
    assets: {
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },
];
