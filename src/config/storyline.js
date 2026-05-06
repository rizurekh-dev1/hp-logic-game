export const CHARACTERS = {
  narrator: {
    id: 'narrator',
    name: 'Narrator',
    emoji: '📜',
    avatar: '/src/assets/avatars/narrator.svg',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700, #FFA000)',
  },
  harry: {
    id: 'harry',
    name: 'Harry',
    emoji: '⚡',
    avatar: '/src/assets/avatars/harry.svg',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #66BB6A, #2E7D32)',
  },
  hermione: {
    id: 'hermione',
    name: 'Hermione',
    emoji: '📚',
    avatar: '/src/assets/avatars/hermione.svg',
    color: '#FF7043',
    gradient: 'linear-gradient(135deg, #FF8A65, #D84315)',
  },
  ron: {
    id: 'ron',
    name: 'Ron',
    emoji: '♟',
    avatar: '/src/assets/avatars/ron.svg',
    color: '#EF5350',
    gradient: 'linear-gradient(135deg, #EF9A9A, #C62828)',
  },
  dumbledore: {
    id: 'dumbledore',
    name: 'Dumbledore',
    emoji: '🦉',
    avatar: '/src/assets/avatars/dumbledore.svg',
    color: '#00E5FF',
    gradient: 'linear-gradient(135deg, #18FFFF, #0097A7)',
  },
  quirrell: {
    id: 'quirrell',
    name: 'Quirrell',
    emoji: '🐍',
    avatar: '/src/assets/avatars/quirrell.svg',
    color: '#AB47BC',
    gradient: 'linear-gradient(135deg, #CE93D8, #6A1B9A)',
  },
  hagrid: {
    id: 'hagrid',
    name: 'Hagrid',
    emoji: '🧺',
    avatar: '/src/assets/avatars/hagrid.svg',
    color: '#8D6E63',
    gradient: 'linear-gradient(135deg, #A1887F, #4E342E)',
  },
};

export const STORYLINE = {
  prologue: [
    {
      character: 'dumbledore',
      text: 'Danger stirs beneath Hogwarts. Someone is trying to steal the Philosopher\'s Stone — and I fear the Dark Lord may return.',
    },
    {
      character: 'harry',
      text: 'We need your logic to get past the traps and save the Stone. Will you help us?',
    },
  ],

  levels: {
    1: {
      intro: [
        {
          character: 'hermione',
          text: 'We fell through the trapdoor! Something\'s wrapping around us — it\'s Devil\'s Snare! It hates light!',
        },
        {
          character: 'harry',
          text: 'The spell is shattered across a broken portrait. Help us put it together — quick!',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'hermione',
          text: 'LUMOS SOLEM! The Devil\'s Snare releases us! Onward — the next chamber is through here.',
        },
      ],
    },

    2: {
      intro: [
        {
          character: 'hermione',
          text: 'Hundreds of enchanted keys... A riddle on the door will tell us which one is real.',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'harry',
          text: 'The key fits! Alohomora! One door down, more to go.',
        },
      ],
    },

    3: {
      intro: [
        {
          character: 'hermione',
          text: 'Black fire blocking the path... and seven potion bottles. Snape\'s riddle — one goes forward, one goes back, the rest are poison.',
        },
      ],
      midgame: [],
      outro: [],
    },

    4: {
      intro: [
        {
          character: 'dumbledore',
          text: 'The Mirror of Erised shows what we desire most. Only one who wishes to find the Stone — not use it — can claim it. The runes will test your logic.',
        },
      ],
      midgame: [],
      outro: [],
    },

    5: {
      intro: [
        {
          character: 'quirrell',
          text: 'So, Potter. Did you really think Snape was the threat? The Stone belongs to the Dark Lord.',
        },
      ],
      midgame: [],
      outro: [],
    },

    6: {
      intro: [
        {
          character: 'ron',
          text: 'My foot! It\'s stuck in the tracks! The Hogwarts Express is coming!',
        },
        {
          character: 'harry',
          text: 'Hold on, Ron! I need to calculate how much time we have before the train reaches the bridge.',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'harry',
          text: 'Got it! Just in time! The train rushes past as we scramble to safety.',
        },
        {
          character: 'ron',
          text: 'Blimey, Harry! You saved my life. I owe you one.',
        },
      ],
    },

    7: {
      intro: [
        {
          character: 'hermione',
          text: 'That blank parchment — it might be the Marauder\'s Map! But it needs a password to activate.',
        },
        {
          character: 'harry',
          text: 'There\'s a cipher key in the corner. Translate the ancient runes to unlock it!',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'harry',
          text: 'LUMOS! The map glows to life! Footprints track everyone in the castle.',
        },
      ],
    },

    8: {
      intro: [
        {
          character: 'harry',
          text: 'Filly the House-Elf is overwhelmed! We need to sort deliveries into the right trunks.',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'harry',
          text: 'All sorted! Filly can rest easy now. Great work!',
        },
      ],
    },

    9: {
      intro: [
        {
          character: 'harry',
          text: 'We need to get into that vault. The scale says 3 Mystery Bags plus 2 coins equals 14 coins. How much is one bag?',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'harry',
          text: 'The vault door opens! The gold is ours! Griphook will be impressed.',
        },
      ],
    },

    10: {
      intro: [
        {
          character: 'harry',
          text: 'Professor Sprout needs the right fence measurements for her Devil\'s Snare patch. Area is 24, Perimeter is 22 — which dimensions fit?',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'harry',
          text: 'The fence fits perfectly! The Devil\'s Snare is safely contained. Sprout is relieved!',
        },
      ],
    },

    11: {
      intro: [
        {
          character: 'ron',
          text: 'We\'re late! The Knight Bus is our only chance to get to Diagon Alley before it closes!',
        },
        {
          character: 'harry',
          text: 'But look — the bus is stuck between two Muggle buses! It needs to shrink and rotate to squeeze through!',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'ron',
          text: 'HONK! Did you see that?! The bus went impossibly thin and zoomed right through!',
        },
        {
          character: 'hermione',
          text: 'Brilliant spatial reasoning! We\'ll make it to Diagon Alley with time to spare.',
        },
      ],
    },
  },

  epilogue: [
    {
      character: 'dumbledore',
      text: 'From the Devil\'s Snare to Gringotts vaults to the Herbology greenhouse — you\'ve mastered every challenge. Well done.',
    },
    {
      character: 'harry',
      text: 'We couldn\'t have done any of it without you. Every puzzle solved, every cipher cracked — you were there.',
    },
    {
      character: 'ron',
      text: 'Even when my foot was stuck on those tracks! Blimey, that was close.',
    },
    {
      character: 'dumbledore',
      text: 'For extraordinary courage, sharp logic, and true friendship, I award the Order of Merlin, First Class... to our unseen hero.',
    },
    {
      character: 'dumbledore',
      text: 'The adventure may be over for now — but Hogwarts will always need a clever mind. Until next time.',
    },
  ],
};
