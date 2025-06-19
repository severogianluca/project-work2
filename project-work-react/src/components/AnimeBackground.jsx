import { useState, useEffect } from 'react';


const AnimeBackground = () => {
  const [petals, setPetals] = useState([]);

  // Genera petali casuali
  useEffect(() => {
    const generatePetals = () => {
      const newPetals = [];
      for (let i = 0; i < 40; i++) {
        newPetals.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          rotation: Math.random() * 360,
          size: Math.random() * 0.8 + 0.4,
          speed: Math.random() * 4 + 2,
          drift: Math.random() * 3 - 1.5,
          opacity: Math.random() * 0.3 + 0.7,
        });
      }
      setPetals(newPetals);
    };

    generatePetals();
    const interval = setInterval(generatePetals, 4000);
    return () => clearInterval(interval);
  }, []);

  const PetalSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 8 6 8 10C8 14 10.5 16 12 16C13.5 16 16 14 16 10C16 6 12 2 12 2Z"
        fill="#FFB7C5"
        opacity="0.9"
      />
      <path
        d="M12 16C12 16 16 12 20 12C24 12 22 14.5 22 16C22 17.5 20 20 16 20C12 20 12 16 12 16Z"
        fill="#FFC0CB"
        opacity="0.8"
      />
      <path
        d="M12 16C12 16 8 12 4 12C0 12 2 14.5 2 16C2 17.5 4 20 8 20C12 20 12 16 12 16Z"
        fill="#FFB7C5"
        opacity="0.8"
      />
      <path
        d="M12 16C12 16 16 20 16 24C16 28 13.5 26 12 26C10.5 26 8 28 8 24C8 20 12 16 12 16Z"
        fill="#FFCCCB"
        opacity="0.7"
      />
      <circle cx="12" cy="16" r="2" fill="#FF69B4" opacity="0.9"/>
    </svg>
  );

  return (
    <div className="anime-background">
      {/* Cielo giapponese */}
      <div className="anime-background__sky"></div>
      
      {/* Nuvole giapponesi stilizzate */}
      <div className="anime-background__clouds anime-background__cloud-1"></div>
      <div className="anime-background__clouds anime-background__cloud-2"></div>
      <div className="anime-background__clouds anime-background__cloud-3"></div>

      {/* Fiori di ciliegio che cadono */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="anime-background__petal"
          style={{
            left: `${petal.x}%`,
            transform: `scale(${petal.size}) rotate(${petal.rotation}deg)`,
            opacity: petal.opacity,
            animation: `petal-fall-${petal.id} ${6 + Math.random() * 4}s linear infinite`,
          }}
        >
          <PetalSVG />
        </div>
      ))}
    </div>
  );
};

export default AnimeBackground;