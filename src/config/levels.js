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
    title: "The Devil's Snare",
    narrative:
      "Harry, Ron and Hermione have fallen through a trapdoor and are being strangled by Devil's Snare. " +
      "Hermione knows the spell to stop it — but the incantation is hidden in a shattered magical portrait. " +
      "Reassemble the portrait to reveal the spell and save them!",
    completionWord: 'LUMOS SOLEM',
    completionMessage: "You remembered the spell! Harry, Ron and Hermione are free. Dumbledore would be proud.",
    grid: { rows: 3, cols: 3 },
    assets: {
      // Drop a new puzzle-image.png here to swap the Level 1 puzzle image.
      // introBackground: not needed — the CSS dark parchment theme is used instead.
      puzzleImage: '/assets/levels/level-01-devils-snare/puzzle-image.png',
    },
  },

  // ── Future levels go here ──────────────────────────────────────────────
  // {
  //   id: 2,
  //   slug: 'level-02-flying-keys',
  //   title: "The Flying Keys",
  //   narrative: "...",
  //   completionWord: 'ALOHOMORA',
  //   grid: { rows: 3, cols: 4 },
  //   assets: {
  //     puzzleImage:     '/assets/levels/level-02-flying-keys/puzzle-image.png',
  //     introBackground: '/assets/levels/level-02-flying-keys/intro-background.jpg',
  //   },
  // },
];
