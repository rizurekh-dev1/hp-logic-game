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
      text: 'The night is quiet at Hogwarts. But beneath the castle, in the forbidden third-floor corridor, danger stirs...',
    },
    {
      character: 'harry',
      text: 'Professor Snape is trying to steal the Philosopher\'s Stone. I saw him in the Forbidden Forest!',
    },
    {
      character: 'hermione',
      text: 'Fluffy — the three-headed dog — is guarding the trapdoor. Whatever is down there, Snape wants it.',
    },
    {
      character: 'ron',
      text: 'Hang on. You two are actually going to face a Dark wizard? On purpose?',
    },
    {
      character: 'harry',
      text: 'If the Stone falls into Voldemort\'s hands, Hogwarts won\'t be safe. I can\'t do this alone — will you help us?',
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
      outro: [
        {
          character: 'hermione',
          text: 'The yellow potion! The flames part for us! We\'re almost there.',
        },
      ],
    },

    4: {
      intro: [
        {
          character: 'dumbledore',
          text: 'The Mirror of Erised shows what we desire most. But only one who wishes to find the Stone — not use it — can claim it.',
        },
        {
          character: 'harry',
          text: 'There\'s a pattern on the mirror\'s frame — a riddle in the runes. I need to solve it to unlock the Stone.',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'harry',
          text: 'I understand! The mirror puts the Stone in my pocket. I\'ve got it!',
        },
      ],
    },

    5: {
      intro: [
        {
          character: 'quirrell',
          text: 'So, Potter. Did you really think Snape was the threat? The Stone belongs to the Dark Lord.',
        },
        {
          character: 'harry',
          text: 'You\'ll have to go through me. And I\'ve got help — someone with logic sharper than any Dark wizard.',
        },
      ],
      midgame: [],
      outro: [
        {
          character: 'dumbledore',
          text: 'You\'ve shown courage, wisdom, and selflessness, Harry. The Stone is safe because you understood its true secret.',
        },
        {
          character: 'harry',
          text: 'I couldn\'t have done it without you — the one who guided us through every challenge.',
        },
      ],
    },
  },

  epilogue: [
    {
      character: 'dumbledore',
      text: 'And so, the Philosopher\'s Stone remains hidden. Another year at Hogwarts saved by a sharp mind and a brave heart.',
    },
    {
      character: 'harry',
      text: 'We couldn\'t have done any of it without you. You helped us solve every puzzle and face every danger.',
    },
    {
      character: 'dumbledore',
      text: 'For extraordinary courage and logic, I award the Order of Merlin, First Class... to our unseen hero.',
    },
    {
      character: 'dumbledore',
      text: 'The adventure may be over — but Hogwarts will always need a clever mind. Until next time.',
    },
  ],
};
