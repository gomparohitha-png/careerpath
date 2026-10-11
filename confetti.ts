import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  // Gold and lavender confetti burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#D4A017', '#F2C94C', '#8E68CD', '#6540AB', '#E6DBFF']
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#D4A017', '#F2C94C', '#8E68CD']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#D4A017', '#F2C94C', '#8E68CD']
    });
  }, 200);
}
