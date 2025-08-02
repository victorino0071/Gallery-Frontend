'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import SplitType from 'split-type';
import { projectTitles, imageUrls } from '@/lib/data';
import styles from '@/styles/Gallery.module.css';

// Tipos para os dados e estado
interface ItemSize {
  width: number;
  height: number;
}

interface GridItem {
  id: string;
  col: number;
  row: number;
  width: number;
  height: number;
  x: number;
  y: number;
  itemNum: number;
  imgSrc: string;
}

interface OriginalPosition {
  id: string;
  rect: DOMRect;
  width: number;
  height: number;
  nameText: string;
  numberText: string;
}

// Configurações estáticas (antes eram do Tweakpane)
const settings = {
  baseWidth: 400,
  smallHeight: 330,
  largeHeight: 500,
  itemGap: 65,
  expandedScale: 0.4,
  dragEase: 0.075,
  momentumFactor: 200,
  bufferZone: 3,
  zoomDuration: 0.6,
  overlayOpacity: 0.9,
  overlayEaseDuration: 0.8,
};

const itemSizes: ItemSize[] = [
  { width: settings.baseWidth, height: settings.smallHeight },
  { width: settings.baseWidth, height: settings.largeHeight },
];
const columns = 4;
const cellWidth = settings.baseWidth + settings.itemGap;
const cellHeight = Math.max(settings.smallHeight, settings.largeHeight) + settings.itemGap;

const Gallery: React.FC = () => {
  // Estado para controlar a UI
  const [renderedItems, setRenderedItems] = useState<GridItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState<GridItem | null>(null);
  const [expandedItemData, setExpandedItemData] = useState<{ src: string, originalPos: OriginalPosition } | null>(null);
  const [projectTitle, setProjectTitle] = useState('');

  // Refs para valores que não precisam disparar re-renderizações
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const projectTitleRef = useRef<HTMLParagraphElement>(null);
  
  const position = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const startDragPos = useRef({ x: 0, y: 0 });
  const lastDragTime = useRef(0);
  const mouseHasMoved = useRef(false);
  
  const visibleItemIds = useRef(new Set<string>());

  // Inicializa o GSAP e SplitType no cliente
  useEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");
  }, []);

  // Função para determinar o tamanho do item com base na posição
  const getItemSize = (row: number, col: number): ItemSize => {
    const sizeIndex = Math.abs((row * columns + col) % itemSizes.length);
    return itemSizes[sizeIndex];
  };

  // Função para calcular a posição absoluta de um item
  const getItemPosition = (col: number, row: number) => ({
    x: col * cellWidth,
    y: row * cellHeight,
  });

  // Função principal para atualizar os itens visíveis na tela
  const updateVisibleItems = useCallback(() => {
    if (!canvasRef.current) return;
    
    const buffer = settings.bufferZone;
    const viewWidth = window.innerWidth * (1 + buffer);
    const viewHeight = window.innerHeight * (1 + buffer);

    const startCol = Math.floor((-position.current.x - viewWidth / 2) / cellWidth);
    const endCol = Math.ceil((-position.current.x + viewWidth * 1.5) / cellWidth);
    const startRow = Math.floor((-position.current.y - viewHeight / 2) / cellHeight);
    const endRow = Math.ceil((-position.current.y + viewHeight * 1.5) / cellHeight);

    const newVisibleItems: GridItem[] = [];
    const currentItemIds = new Set<string>();

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const id = `${col},${row}`;
        currentItemIds.add(id);

        if (visibleItemIds.current.has(id) && !isExpanded) {
            // Se o item já existe, apenas o adiciona à nova lista para manter
            const existingItem = renderedItems.find(item => item.id === id);
            if (existingItem) newVisibleItems.push(existingItem);
            continue;
        }

        const itemSize = getItemSize(row, col);
        const pos = getItemPosition(col, row);
        const itemNum = Math.abs((row * columns + col) % projectTitles.length);

        newVisibleItems.push({
          id,
          col,
          row,
          width: itemSize.width,
          height: itemSize.height,
          x: pos.x,
          y: pos.y,
          itemNum,
          imgSrc: imageUrls[itemNum % imageUrls.length],
        });
      }
    }
    
    setRenderedItems(newVisibleItems);
    visibleItemIds.current = currentItemIds;
  }, [renderedItems, isExpanded]);
  
  // Efeito para animação do canvas (arrastar)
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      const ease = settings.dragEase;
      position.current.x += (targetPosition.current.x - position.current.x) * ease;
      position.current.y += (targetPosition.current.y - position.current.y) * ease;

      if (canvasRef.current) {
        canvasRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
      }

      // Otimização para chamar updateVisibleItems menos vezes
      if (Math.abs(targetPosition.current.x - position.current.x) > 1 || Math.abs(targetPosition.current.y - position.current.y) > 1) {
        updateVisibleItems();
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [updateVisibleItems]);

  // Efeito para registrar os event listeners (mouse, touch, resize)
  useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (isExpanded) return;
      isDragging.current = true;
      mouseHasMoved.current = false;
      startDragPos.current = { x: e.clientX, y: e.clientY };
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || isExpanded) return;
      
      const dx = e.clientX - startDragPos.current.x;
      const dy = e.clientY - startDragPos.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        mouseHasMoved.current = true;
      }

      const now = Date.now();
      const dt = Math.max(10, now - lastDragTime.current);
      lastDragTime.current = now;

      velocity.current = { x: dx / dt, y: dy / dt };
      targetPosition.current.x += dx;
      targetPosition.current.y += dy;
      startDragPos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (containerRef.current) containerRef.current.style.cursor = 'grab';

      if (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1) {
        targetPosition.current.x += velocity.current.x * settings.momentumFactor;
        targetPosition.current.y += velocity.current.y * settings.momentumFactor;
      }
    };
    
    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      if (isExpanded) return;
      isDragging.current = true;
      mouseHasMoved.current = false;
      startDragPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging.current || isExpanded) return;
        const dx = e.touches[0].clientX - startDragPos.current.x;
        const dy = e.touches[0].clientY - startDragPos.current.y;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            mouseHasMoved.current = true;
        }

        targetPosition.current.x += dx;
        targetPosition.current.y += dy;
        startDragPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
    };
    
    const handleResize = () => {
      updateVisibleItems();
      // Lógica para redimensionar item expandido se necessário
    };
    
    cont.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    cont.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    return () => {
      cont.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cont.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, [isExpanded, updateVisibleItems]);

  // Função para expandir um item
  const handleItemClick = (item: GridItem, e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseHasMoved.current) return;
    
    setIsExpanded(true);
    setActiveItem(item);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const originalPos: OriginalPosition = {
      id: item.id,
      rect,
      width: item.width,
      height: item.height,
      nameText: projectTitles[item.itemNum],
      numberText: `#${(item.itemNum + 1).toString().padStart(5, "0")}`
    };

    setExpandedItemData({ src: item.imgSrc, originalPos });
    setProjectTitle(projectTitles[item.itemNum]);

    // Anima o overlay para dentro
    gsap.to(overlayRef.current, {
      opacity: settings.overlayOpacity,
      duration: settings.overlayEaseDuration,
      ease: 'power2.inOut'
    });

    // Anima o desaparecimento dos outros itens
    gsap.to(`.${styles.item}:not([data-id='${item.id}'])`, {
      opacity: 0,
      duration: settings.overlayEaseDuration,
    });
  };
  
  // Função para fechar o item expandido
  const closeExpandedItem = useCallback(() => {
    if (!expandedItemData) return;

    // Anima o título para fora
    if(projectTitleRef.current){
        const split = new SplitType(projectTitleRef.current, { types: 'words' });
        gsap.to(split.words, {
            y: '-100%',
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            onComplete: () => {
                setProjectTitle('');
                split.revert();
            }
        });
    }

    // Anima o overlay para fora
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: settings.overlayEaseDuration,
      ease: 'power2.inOut',
    });

    // Anima a volta dos outros itens
    gsap.to(`.${styles.item}`, {
      opacity: 1,
      duration: settings.overlayEaseDuration,
      delay: 0.3
    });

    setIsExpanded(false);
    setActiveItem(null);
    setExpandedItemData(null);
  }, [expandedItemData]);


  // Efeito para animar o título quando ele muda
  useEffect(() => {
    if (projectTitle && projectTitleRef.current) {
      const titleEl = projectTitleRef.current;
      titleEl.textContent = projectTitle;
      const split = new SplitType(titleEl, { types: 'words' });
      gsap.fromTo(split.words,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
      );
    }
  }, [projectTitle]);
  
  // Efeito para animar o item expandido
  useEffect(() => {
    if (isExpanded && expandedItemData) {
      const { src, originalPos } = expandedItemData;
      const { rect, width, height } = originalPos;

      const expandedDiv = document.createElement('div');
      expandedDiv.className = styles.expandedItem;
      const img = document.createElement('img');
      img.src = src;
      expandedDiv.appendChild(img);
      document.body.appendChild(expandedDiv);
      
      expandedDiv.addEventListener('click', closeExpandedItem);

      const viewportWidth = window.innerWidth;
      const targetWidth = viewportWidth * settings.expandedScale;
      const aspectRatio = height / width;
      const targetHeight = targetWidth * aspectRatio;

      gsap.fromTo(expandedDiv, {
        width: width,
        height: height,
        x: rect.left + width / 2 - window.innerWidth / 2,
        y: rect.top + height / 2 - window.innerHeight / 2,
      }, {
        width: targetWidth,
        height: targetHeight,
        x: 0,
        y: 0,
        duration: settings.zoomDuration,
        ease: 'hop',
      });
      
      // Cleanup
      return () => {
          gsap.to(expandedDiv, {
              width: width,
              height: height,
              x: rect.left + width / 2 - window.innerWidth / 2,
              y: rect.top + height / 2 - window.innerHeight / 2,
              duration: settings.zoomDuration,
              ease: 'hop',
              onComplete: () => {
                  expandedDiv.remove();
              }
          })
      }
    }
  }, [isExpanded, expandedItemData, closeExpandedItem]);
  
  // Efeito para animar os itens quando entram e saem da tela
  useEffect(() => {
      renderedItems.forEach(item => {
          const el = document.querySelector(`[data-id='${item.id}']`);
          if(el) {
              gsap.to(el, { autoAlpha: 1, duration: 0.5 });
              // Animar a legenda
              const caption = el.querySelector(`.${styles.itemCaption}`);
              gsap.to(caption, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' });
          }
      });
  }, [renderedItems]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.canvas} ref={canvasRef}>
        {renderedItems.map((item) => (
          <div
            key={item.id}
            data-id={item.id}
            className={styles.item}
            style={{
              width: `${item.width}px`,
              height: `${item.height}px`,
              left: `${item.x}px`,
              top: `${item.y}px`,
            }}
            onClick={(e) => handleItemClick(item, e)}
          >
            <div className={styles.itemImageContainer}>
              <img src={item.imgSrc} alt={`Project ${item.itemNum + 1}`} />
            </div>
            <div className={styles.itemCaption}>
              <div className={styles.itemName}>{projectTitles[item.itemNum]}</div>
              <div className={styles.itemNumber}>
                #{(item.itemNum + 1).toString().padStart(5, "0")}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`${styles.overlay} ${isExpanded ? styles.active : ''}`} ref={overlayRef} onClick={closeExpandedItem}></div>

      {isExpanded && (
        <div className={styles.projectTitle}>
          <p ref={projectTitleRef}></p>
        </div>
      )}
      
      <div className={styles.pageVignetteContainer}>
          <div className={styles.pageVignette}></div>
          <div className={styles.pageVignetteStrong}></div>
          <div className={styles.pageVignetteExtreme}></div>
      </div>
    </div>
  );
};

export default Gallery;