const WORDS = [
  'PI', 'SUM', 'PLUS', 'MINUS', 'TRIANGLE', 'SQUARE', 'CIRCLE', 'ROOT', 'PRIME', 'LOGIC',
  'BRAIN', 'SMART', 'MATH', 'STAR', 'BLUE', 'SUN', 'MOON', 'FAST', 'OPEN', 'WISE',
  'QUICK', 'COOL', 'BRIGHT', 'GOLD', 'TEAM', 'SOLVE', 'STEP', 'PATH', 'GOAL', 'PEAK'
];

export function generateRoomCode(): string {
  const word1 = WORDS[Math.floor(Math.random() * WORDS.length)];
  const word2 = WORDS[Math.floor(Math.random() * WORDS.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 10-99
  
  return `${word1}-${word2}-${num}`;
}
