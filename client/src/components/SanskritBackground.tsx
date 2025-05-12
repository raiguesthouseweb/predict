import React, { useEffect, useState } from 'react';

// Sanskrit alphabets
const sanskritAlphabets = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः',
  'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण',
  'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'
];

interface SanskritLetter {
  char: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  id: number;
}

export function SanskritBackground() {
  const [letters, setLetters] = useState<SanskritLetter[]>([]);
  
  useEffect(() => {
    // Generate initial letters
    const initialLetters: SanskritLetter[] = [];
    for (let i = 0; i < 25; i++) {
      initialLetters.push({
        char: sanskritAlphabets[Math.floor(Math.random() * sanskritAlphabets.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.3 + 0.1, // Between 0.1 and 0.4
        scale: Math.random() * 0.5 + 0.5, // Between 0.5 and 1
        id: i
      });
    }
    
    setLetters(initialLetters);
    
    // Periodically refresh letters
    const interval = setInterval(() => {
      setLetters(prevLetters => {
        return prevLetters.map(letter => {
          // 30% chance to change the letter
          if (Math.random() < 0.3) {
            return {
              ...letter,
              char: sanskritAlphabets[Math.floor(Math.random() * sanskritAlphabets.length)],
              opacity: Math.random() * 0.3 + 0.1, // Between 0.1 and 0.4
            };
          }
          return letter;
        });
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {letters.map(letter => (
        <div
          key={letter.id}
          className="absolute"
          style={{
            left: `${letter.x}%`,
            top: `${letter.y}%`,
            opacity: letter.opacity,
            transform: `scale(${letter.scale})`,
            color: 'rgba(255, 120, 0, 0.7)', // Neon orange with low intensity
            fontFamily: 'serif',
            fontSize: '4rem',
            textShadow: '0 0 8px rgba(255, 120, 0, 0.7)',
            transition: 'opacity 1s ease-in-out'
          }}
        >
          {letter.char}
        </div>
      ))}
    </div>
  );
}