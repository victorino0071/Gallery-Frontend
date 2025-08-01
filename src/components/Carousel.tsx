// components/Carousel.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';

// Definição de tipos para o nosso card
interface CardData {
  id: number;
  title: string;
  description: string;
  phase: string;
  completion: number;
  tags: string[];
  imageUrl: string;
  colorClass: string;
  dataText: string;
}

// Componente individual para cada card
const CarouselCard: React.FC<{
  card: CardData;
  isActive: boolean;
  isPrev: boolean;
  isNext: boolean;
  isFar: boolean;
}> = ({ card, isActive, isPrev, isNext, isFar }) => {
  const cardClasses = `carousel-card ${isActive ? 'is-active' : ''} ${isPrev ? 'is-prev' : ''} ${isNext ? 'is-next' : ''} ${isFar ? 'is-far-next' : ''}`;

  return (
    <div className={cardClasses}>
      <div className="card-image-container">
        <img src={card.imageUrl} alt={card.title} className="card-image" />
      </div>
      <div className="card-content">
        <h3 className={`card-title text-xl font-bold ${card.colorClass}`} data-text={card.dataText}>
          {card.title}
        </h3>
        <p className="card-description">{card.description}</p>
        <div className="card-progress">
          <div className="progress-value" style={{ width: `${card.completion}%` }}></div>
        </div>
        <div className="card-stats">
          <span>{card.phase}</span>
          <span>{card.completion}% COMPLETE</span>
        </div>
      </div>
      <div className="tech-details">
        {card.tags.map((tag, index) => (
          <div key={index} className="tech-tag">{tag}</div>
        ))}
      </div>
    </div>
  );
};

// Componente principal do Carrossel
const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Começa no terceiro card
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cardsData: CardData[] = [
    {
      id: 1,
      title: "Project Alpha",
      description: "Exploring the neon-drenched landscapes of a digital frontier. AI-driven procedural generation creates infinite cityscapes.",
      phase: "PHASE II",
      completion: 65,
      tags: ["Neural Networks", "Voxel Systems", "Quantum Rendering"],
      imageUrl: "https://picsum.photos/320/200?t=1",
      colorClass: "text-cyan-400",
      dataText: "Project Alpha"
    },
    {
      id: 2,
      title: "Neuro-Link UI",
      description: "Designing intuitive interfaces for brain-computer interaction. Holographic elements respond to neural patterns.",
      phase: "PHASE I",
      completion: 42,
      tags: ["BCI Framework", "Gesture Recognition", "Thought Mapping"],
      imageUrl: "https://picsum.photos/320/200?t=2",
      colorClass: "text-blue-400",
      dataText: "Neuro-Link UI"
    },
    {
      id: 3,
      title: "Quantum Entanglement",
      description: "Visualizing complex quantum states through advanced rendering techniques. Real-time simulation of parallel realities.",
      phase: "PHASE III",
      completion: 89,
      tags: ["Q-Bit Architecture", "Multiverse Modeling", "Probability Fields"],
      imageUrl: "https://picsum.photos/320/200?t=3",
      colorClass: "text-purple-400",
      dataText: "Quantum Entanglement"
    },
    {
      id: 4,
      title: "Project Chimera",
      description: "Developing next-gen propulsion systems for deep space exploration. Fusion drive concepts push beyond known physics.",
      phase: "PHASE II",
      completion: 51,
      tags: ["Dark Energy Capture", "Plasma Containment", "Gravitational Lensing"],
      imageUrl: "https://picsum.photos/320/200?t=4",
      colorClass: "text-amber-400",
      dataText: "Project Chimera"
    },
    {
      id: 5,
      title: "Aether Network",
      description: "Building a decentralized data network leveraging quantum blockchain and next-gen P2P technology.",
      phase: "PHASE III",
      completion: 78,
      tags: ["Quantum Encryption", "Self-Healing Nodes", "Data Holograms"],
      imageUrl: "https://picsum.photos/320/200?t=5",
      colorClass: "text-emerald-400",
      dataText: "Aether Network"
    },
  ];

  const moveToSlide = useCallback((targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= cardsData.length) return;

    setCurrentIndex(targetIndex);

    // Lógica para centralizar o carrossel
    if (carouselTrackRef.current && containerRef.current) {
      const card = carouselTrackRef.current.children[0] as HTMLElement;
      if (card) {
        const cardWidth = card.offsetWidth;
        const cardMargin = parseInt(window.getComputedStyle(card).marginRight) * 2;
        const amountToMove = targetIndex * (cardWidth + cardMargin);
        const containerCenter = containerRef.current.offsetWidth / 2;
        const cardCenter = cardWidth / 2;
        const targetTranslateX = containerCenter - cardCenter - amountToMove;

        carouselTrackRef.current.style.transform = `translateX(${targetTranslateX - 25}px)`;
      }
    }
  }, [cardsData.length]);

  const handlePrevClick = () => {
    moveToSlide(currentIndex - 1);
  };

  const handleNextClick = () => {
    moveToSlide(currentIndex + 1);
  };

  const handleIndicatorClick = (index: number) => {
    moveToSlide(index);
  };

  // Efeito para iniciar o carrossel e lidar com redimensionamento
  useEffect(() => {
    const handleResize = () => moveToSlide(currentIndex);
    window.addEventListener('resize', handleResize);
    moveToSlide(currentIndex);
    return () => window.removeEventListener('resize', handleResize);
  }, [moveToSlide, currentIndex]);

  // Efeito para lidar com navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextClick();
      if (e.key === 'ArrowLeft') handlePrevClick();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]); // Dependência para garantir que a lógica use o estado atual

  // Efeito para animações e drag
  useEffect(() => {
    // Aqui você integraria a lógica de drag, flashes, etc.
    // O código original é bem complexo e precisa de uma refatoração maior para o React.
    // Em React, o ideal é usar bibliotecas como 'react-draggable' ou implementar a lógica de drag
    // manualmente com `useState` e `useRef` para controlar a posição.
    // A lógica de animação por classes pode ser mantida, mas as animações de `box-shadow` e `transform`
    // por JS deveriam ser gerenciadas por estados no React ou por uma biblioteca de animação.
    // Por simplicidade e foco na migração, mantivemos a lógica de drag fora, mas é o próximo passo.

    // Exemplo de como você poderia ativar a animação do progresso
    const activeCardElement = carouselTrackRef.current?.children[currentIndex] as HTMLElement;
    if (activeCardElement) {
        const progressBar = activeCardElement.querySelector(".progress-value") as HTMLElement;
        const completionText = activeCardElement.querySelector(".card-stats span:last-child")?.textContent;
        const percentageMatch = completionText?.match(/(\d+)%/);

        if (progressBar && percentageMatch) {
            const targetPercentage = parseInt(percentageMatch[1]);
            progressBar.style.transition = "width 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67)";
            progressBar.style.width = `${targetPercentage}%`;
        }
    }
    
    // Cleanup function para resetar transições
    return () => {
      const progressBars = document.querySelectorAll(".progress-value");
        progressBars.forEach((bar) => {
          (bar as HTMLElement).style.transition = "none";
        });
    };
  }, [currentIndex]);


  return (
    <div className="carousel-container" ref={containerRef}>
      <div className="carousel-track" ref={carouselTrackRef}>
        {cardsData.map((card, index) => (
          <CarouselCard
            key={card.id}
            card={card}
            isActive={index === currentIndex}
            isPrev={index === currentIndex - 1}
            isNext={index === currentIndex + 1}
            isFar={index > currentIndex + 1}
          />
        ))}
      </div>

      <button className="carousel-button prev" onClick={handlePrevClick} disabled={currentIndex === 0}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button className="carousel-button next" onClick={handleNextClick} disabled={currentIndex === cardsData.length - 1}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="carousel-indicators">
        {cardsData.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleIndicatorClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;