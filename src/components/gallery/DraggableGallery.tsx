"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

// Importações de tipos e configurações
import { ItemData, ActiveItemData } from "./gallery.types";
import { GALLERY_CONFIG, projectItems, imageUrls, itemSizes, trueMod } from "./gallery.config";

// Importações de componentes
import GalleryItem from "./GalleryItem";
import ExpandedItemView from "./ExpandedItemView";
import ProjectTitle, { ProjectTitleRef } from "./ProjectTitle";

// Importação do nosso arquivo de estilos
import styles from '../../styles/Gallery.module.css';

const DraggableGallery: React.FC = () => {
    // Refs e State
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const projectTitleRef = useRef<ProjectTitleRef>(null);

    const pos = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });
    const dragInfo = useRef({ startX: 0, startY: 0, isDragging: false, velocityX: 0, velocityY: 0, lastDragTime: 0 });
    const mouseHasMoved = useRef(false);
    const animationFrameId = useRef<number | null>(null);

    const [renderedItems, setRenderedItems] = useState<ItemData[]>([]);
    const [activeItemData, setActiveItemData] = useState<ActiveItemData | null>(null);

    // Cálculos e Lógica (sem alterações nesta parte)
    const cellWidth = GALLERY_CONFIG.baseWidth + GALLERY_CONFIG.itemGap;
    const cellHeight = Math.max(GALLERY_CONFIG.smallHeight, GALLERY_CONFIG.largeHeight) + GALLERY_CONFIG.itemGap;
    const columns = 4;


    const getItemSize = useCallback((row: number, col: number) => {
        const sizeIndex = trueMod(row * columns + col, itemSizes.length);
        return itemSizes[sizeIndex];
    }, [columns]);
    
    const lastUpdate = useRef(0);
    const updateVisibleItems = useCallback(() => {
        if (Date.now() - lastUpdate.current < 100 && dragInfo.current.isDragging) return;
        lastUpdate.current = Date.now();
        if (!pos.current) return;

        const buffer = GALLERY_CONFIG.bufferZone;
        const viewWidth = window.innerWidth;
        const viewHeight = window.innerHeight;
        const startCol = Math.floor((-pos.current.currentX - viewWidth * buffer) / cellWidth);
        const endCol = Math.ceil((-pos.current.currentX + viewWidth * (1 + buffer)) / cellWidth);
        const startRow = Math.floor((-pos.current.currentY - viewHeight * buffer) / cellHeight);
        const endRow = Math.ceil((-pos.current.currentY + viewHeight * (1 + buffer)) / cellHeight);

        const newVisibleItems: ItemData[] = [];
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const itemId = `${col},${row}`;
                const itemNum = trueMod(row * columns + col, projectItems.length);
                const size = getItemSize(row, col);
                newVisibleItems.push({
                    id: itemId,
                    x: col * cellWidth,
                    y: row * cellHeight,
                    width: size.width,
                    height: size.height,
                    title: projectItems[itemNum],
                    imageUrl: imageUrls[trueMod(itemNum, imageUrls.length)],
                    itemIndex: itemNum,
                });
            }
        }
        setRenderedItems(newVisibleItems);
    }, [cellWidth, cellHeight, getItemSize, columns]);

    const expandItem = (itemEl: HTMLDivElement, itemData: ItemData) => {
        if (dragInfo.current.isDragging && mouseHasMoved.current) return;
        
        const rect = itemEl.getBoundingClientRect();
        setActiveItemData({
            id: itemData.id,
            rect,
            title: itemData.title,
            imageUrl: itemData.imageUrl,
            width: itemData.width,
            height: itemData.height,
        });

        gsap.to(overlayRef.current, { opacity: GALLERY_CONFIG.overlayOpacity, duration: GALLERY_CONFIG.overlayDuration, ease: "power2.inOut" });
        gsap.delayedCall(GALLERY_CONFIG.zoomDuration * 0.5, () => projectTitleRef.current?.animate(itemData.title, "in"));
    };

    const closeExpandedItem = () => {
        if (!activeItemData) return;
        projectTitleRef.current?.animate(activeItemData.title, "out");
        gsap.to(overlayRef.current, { opacity: 0, duration: GALLERY_CONFIG.overlayDuration, ease: "power2.inOut" });
    };

    const onExpansionAnimationComplete = () => {
        setActiveItemData(null);
    };

    // UseEffects (sem alterações nesta parte)
    useEffect(() => {
        gsap.registerPlugin(CustomEase);
        CustomEase.create("hop", "0.5, 0, 0, 1");
        updateVisibleItems();
    }, [updateVisibleItems]);
    
    useEffect(() => {
        const animate = () => {
            const ease = GALLERY_CONFIG.dragEase;
            pos.current.currentX += (pos.current.targetX - pos.current.currentX) * ease;
            pos.current.currentY += (pos.current.targetY - pos.current.currentY) * ease;

            if (canvasRef.current && !activeItemData) {
                canvasRef.current.style.transform = `translate(${pos.current.currentX}px, ${pos.current.currentY}px) translateZ(0)`;
            }

            if (Math.abs(pos.current.targetX - pos.current.currentX) > 1 || Math.abs(pos.current.targetY - pos.current.currentY) > 1) {
                updateVisibleItems();
            }
            animationFrameId.current = requestAnimationFrame(animate);
        };
        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [activeItemData, updateVisibleItems]);

    useEffect(() => {
        const cont = containerRef.current;
        if (!cont) return;

        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            if (activeItemData) return;
            dragInfo.current.isDragging = true;
            mouseHasMoved.current = false;
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
            dragInfo.current.startX = clientX;
            dragInfo.current.startY = clientY;
            cont.style.cursor = "grabbing";
        };

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (!dragInfo.current.isDragging || activeItemData) return;
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
            const dx = clientX - dragInfo.current.startX;
            const dy = clientY - dragInfo.current.startY;
            if ((!mouseHasMoved.current && Math.abs(dx) > 5) || Math.abs(dy) > 5) {
                mouseHasMoved.current = true;
            }
            const now = Date.now();
            const dt = Math.max(16, now - dragInfo.current.lastDragTime);
            dragInfo.current.lastDragTime = now;
            dragInfo.current.velocityX = dx / dt;
            dragInfo.current.velocityY = dy / dt;
            pos.current.targetX += dx;
            pos.current.targetY += dy;
            dragInfo.current.startX = clientX;
            dragInfo.current.startY = clientY;
        };

        const handleMouseUp = () => {
            if (!dragInfo.current.isDragging) return;

            setTimeout(() => { dragInfo.current.isDragging = false; }, 50);

            if (activeItemData) return;
            cont.style.cursor = "grab";
            if (Math.abs(dragInfo.current.velocityX) > 0.1 || Math.abs(dragInfo.current.velocityY) > 0.1) {
                pos.current.targetX += dragInfo.current.velocityX * GALLERY_CONFIG.momentumFactor;
                pos.current.targetY += dragInfo.current.velocityY * GALLERY_CONFIG.momentumFactor;
            }
        };

        const handleResize = () => updateVisibleItems();
        
        cont.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        cont.addEventListener("touchstart", handleMouseDown, { passive: true });
        window.addEventListener("touchmove", handleMouseMove, { passive: true });
        window.addEventListener("touchend", handleMouseUp);
        window.addEventListener("resize", handleResize);

        return () => {
            cont.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            cont.removeEventListener("touchstart", handleMouseDown);
            window.removeEventListener("touchmove", handleMouseMove);
            window.removeEventListener("touchend", handleMouseUp);
            window.removeEventListener("resize", handleResize);
        };
    }, [activeItemData, updateVisibleItems]);

    return (
        <>
            <div className={styles.container} ref={containerRef} style={{ cursor: 'grab' }}>
                <div className={styles.canvas} ref={canvasRef}>
                    {renderedItems.map((item) => (
                        <GalleryItem
                            key={item.id}
                            item={item}
                           
                            onClick={(element, itemData) => !mouseHasMoved.current && expandItem(element, itemData)}
                        />
                    ))}
                </div>

                <div className={styles.overlay} ref={overlayRef} onClick={closeExpandedItem}></div>
            </div>


            {activeItemData && (
                <ExpandedItemView
                    data={activeItemData}
                    onStartClose={closeExpandedItem}
                    onAnimationComplete={onExpansionAnimationComplete}
                />
            )}

            <div className={styles['page-vignette-container']}>
                <div className={styles['page-vignette']}></div>
                <div className={styles['page-vignette-strong']}></div>
                <div className={styles['page-vignette-extreme']}></div>
            </div>
        </>
    );
};

export default DraggableGallery;