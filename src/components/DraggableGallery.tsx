// Em components/DraggableGallery.tsx

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

import { gsap } from "gsap";

import { CustomEase } from "gsap/CustomEase";

import SplitType from "split-type";

// --- FUNÇÃO AUXILIAR PARA O CÁLCULO CORRETO DO MÓDULO ---

const trueMod = (n: number, max: number) => ((n % max) + max) % max;

// --- DADOS E CONFIGURAÇÕES FIXAS ---

const projectItems = [
    "Chromatic Loopscape",
    "Solar Bloom",
    "Neon Handscape",
    "Echo Discs",

    "Void Gaze",
    "Gravity Sync",
    "Heat Core",
    "Fractal Mirage",
    "Nova Pulse",

    "Sonic Horizon",
    "Dream Circuit",
    "Lunar Mesh",
    "Radiant Dusk",

    "Pixel Drift",
    "Vortex Bloom",
    "Shadow Static",
    "Crimson Phase",

    "Retro Cascade",
    "Photon Fold",
    "Zenith Flow",
];

const imageUrls = [
    "https://cdn.cosmos.so/0f164449-f65e-4584-9d62-a9b3e1f4a90a?format=jpeg",

    "https://cdn.cosmos.so/74ccf6cc-7672-4deb-ba13-1727b7dc6146?format=jpeg",

    "https://cdn.cosmos.so/2f49a117-05e7-4ae9-9e95-b9917f970adb?format=jpeg",

    "https://cdn.cosmos.so/7b5340f5-b4dc-4c08-8495-c507fa81480b?format=jpeg",

    "https://cdn.cosmos.so/f733585a-081e-48e7-a30e-e636446f2168?format=jpeg",

    "https://cdn.cosmos.so/47caf8a0-f456-41c5-98ea-6d0476315731?format=jpeg",

    "https://cdn.cosmos.so/f99f8445-6a19-4a9a-9de3-ac382acc1a3f?format=jpeg",
];

const GALLERY_CONFIG = {
    baseWidth: 400,
    smallHeight: 330,
    largeHeight: 500,
    itemGap: 65,

    hoverScale: 1.05,
    expandedScale: 0.5,
    dragEase: 0.075,

    momentumFactor: 200,
    bufferZone: 3,
    zoomDuration: 0.8,

    overlayOpacity: 0.9,
    overlayDuration: 0.6,
};

// --- TIPOS (TYPESCRIPT) ---

interface ItemSize {
    width: number;
    height: number;
}

interface ItemData {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    imageUrl: string;
    itemIndex: number;
}

interface ActiveItemData {
    id: string;
    rect: DOMRect;
    title: string;
    imageUrl: string;
    width: number;
    height: number;
}

const itemSizes: ItemSize[] = [
    { width: GALLERY_CONFIG.baseWidth, height: GALLERY_CONFIG.smallHeight },

    { width: GALLERY_CONFIG.baseWidth, height: GALLERY_CONFIG.largeHeight },
];

// --- O COMPONENTE ---

const DraggableGallery: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const canvasRef = useRef<HTMLDivElement>(null);

    const overlayRef = useRef<HTMLDivElement>(null);

    const projectTitleRef = useRef<HTMLParagraphElement>(null);

    const pos = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });

    const dragInfo = useRef({
        startX: 0,
        startY: 0,
        isDragging: false,
        velocityX: 0,
        velocityY: 0,
        lastDragTime: 0,
    });

    const mouseHasMoved = useRef(false);

    const animationFrameId = useRef<number | null>(null);

    const [renderedItems, setRenderedItems] = useState<ItemData[]>([]);

    const [activeItemData, setActiveItemData] = useState<ActiveItemData | null>(
        null
    );

    const cellWidth = GALLERY_CONFIG.baseWidth + GALLERY_CONFIG.itemGap;

    const cellHeight =
        Math.max(GALLERY_CONFIG.smallHeight, GALLERY_CONFIG.largeHeight) +
        GALLERY_CONFIG.itemGap;

    const columns = 4;

    const getItemSize = useCallback(
        (row: number, col: number): ItemSize => {
            const sizeIndex = trueMod(row * columns + col, itemSizes.length);

            return itemSizes[sizeIndex];
        },
        [columns]
    );

    const lastUpdate = useRef(0);

    const updateVisibleItems = useCallback(() => {
        if (
            Date.now() - lastUpdate.current < 100 &&
            dragInfo.current.isDragging
        )
            return;

        lastUpdate.current = Date.now();

        if (!pos.current) return;

        const buffer = GALLERY_CONFIG.bufferZone;

        const viewWidth = window.innerWidth;

        const viewHeight = window.innerHeight;

        const startCol = Math.floor(
            (-pos.current.currentX - viewWidth * buffer) / cellWidth
        );

        const endCol = Math.ceil(
            (-pos.current.currentX + viewWidth * (1 + buffer)) / cellWidth
        );

        const startRow = Math.floor(
            (-pos.current.currentY - viewHeight * buffer) / cellHeight
        );

        const endRow = Math.ceil(
            (-pos.current.currentY + viewHeight * (1 + buffer)) / cellHeight
        );

        const newVisibleItems: ItemData[] = [];

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const itemId = `${col},${row}`;

                const itemNum = trueMod(
                    row * columns + col,
                    projectItems.length
                );

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

        setRenderedItems((prev) => {
            const prevIds = new Set(prev.map((item) => item.id));

            const newIds = new Set(newVisibleItems.map((item) => item.id));

            return prev.length === newVisibleItems.length &&
                [...prevIds].every((id) => newIds.has(id))
                ? prev
                : newVisibleItems;
        });
    }, [cellWidth, cellHeight, getItemSize, columns]);

    const animateTitle = (title: string, direction: "in" | "out") => {
        if (!projectTitleRef.current) return;

        const titleEl = projectTitleRef.current;

        gsap.killTweensOf(titleEl.querySelectorAll(".word"));

        if (direction === "in") {
            titleEl.textContent = title;

            const split = new SplitType(titleEl, { types: "words" });

            (titleEl as any).splitInstance = split;

            gsap.fromTo(
                split.words,
                { y: "100%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    duration: 1,
                    stagger: 0.05,
                    ease: "power3.out",
                }
            );
        } else {
            const split = (titleEl as any).splitInstance as SplitType;

            if (split && split.words) {
                gsap.to(split.words, {
                    y: "-100%",
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "power3.in",

                    onComplete: () => {
                        split.revert();

                        (titleEl as any).splitInstance = null;

                        titleEl.textContent = "";
                    },
                });
            }
        }
    };

    const expandItem = (itemEl: HTMLDivElement, itemData: ItemData) => {
        mouseHasMoved.current = false;

        if (dragInfo.current.isDragging) return;

        const rect = itemEl.getBoundingClientRect();

        setActiveItemData({
            id: itemData.id,
            rect,
            title: itemData.title,
            imageUrl: itemData.imageUrl,
            width: itemData.width,
            height: itemData.height,
        });

        gsap.to(overlayRef.current, {
            opacity: GALLERY_CONFIG.overlayOpacity,
            duration: GALLERY_CONFIG.overlayDuration,
            ease: "power2.inOut",
        });

        gsap.delayedCall(GALLERY_CONFIG.zoomDuration * 0.5, () =>
            animateTitle(itemData.title, "in")
        );
    };

    const closeExpandedItem = () => {
        if (!activeItemData) return;

        animateTitle(activeItemData.title, "out");

        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: GALLERY_CONFIG.overlayDuration,
            ease: "power2.inOut",
        });
    };

    const onExpansionAnimationComplete = () => {
        setActiveItemData(null);
    };

    useEffect(() => {
        gsap.registerPlugin(CustomEase);

        CustomEase.create("hop", "0.5, 0, 0, 1");

        updateVisibleItems();
    }, [updateVisibleItems]);

    useEffect(() => {
        const animate = () => {
            const ease = GALLERY_CONFIG.dragEase;

            pos.current.currentX +=
                (pos.current.targetX - pos.current.currentX) * ease;

            pos.current.currentY +=
                (pos.current.targetY - pos.current.currentY) * ease;

            if (canvasRef.current && !activeItemData) {
                canvasRef.current.style.transform = `translate(${pos.current.currentX}px, ${pos.current.currentY}px) translateZ(0)`;
            }

            if (
                Math.abs(pos.current.targetX - pos.current.currentX) > 1 ||
                Math.abs(pos.current.targetY - pos.current.currentY) > 1
            ) {
                updateVisibleItems();
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current)
                cancelAnimationFrame(animationFrameId.current);
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

            if (
                (!mouseHasMoved.current && Math.abs(dx) > 5) ||
                Math.abs(dy) > 5
            ) {
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

            dragInfo.current.isDragging = false;

            if (activeItemData) return;

            cont.style.cursor = "grab";

            if (
                Math.abs(dragInfo.current.velocityX) > 0.1 ||
                Math.abs(dragInfo.current.velocityY) > 0.1
            ) {
                pos.current.targetX +=
                    dragInfo.current.velocityX * GALLERY_CONFIG.momentumFactor;

                pos.current.targetY +=
                    dragInfo.current.velocityY * GALLERY_CONFIG.momentumFactor;
            }
        };

        const handleResize = () => updateVisibleItems();

        cont.addEventListener("mousedown", handleMouseDown);

        window.addEventListener("mousemove", handleMouseMove);

        window.addEventListener("mouseup", handleMouseUp);

        cont.addEventListener("touchstart", handleMouseDown, { passive: true });

        window.addEventListener("touchmove", handleMouseMove, {
            passive: true,
        });

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
            <div className="container" ref={containerRef}>
                <div className="canvas" ref={canvasRef}>
                    {renderedItems.map((item) => (
                        <div
                            key={item.id}
                            className="item"
                            style={{
                                width: `${item.width}px`,
                                height: `${item.height}px`,
                                left: `${item.x}px`,
                                top: `${item.y}px`,
                                opacity: activeItemData ? 0 : 1,
                            }}
                            onClick={(e) =>
                                !mouseHasMoved.current &&
                                expandItem(e.currentTarget, item)
                            }
                        >
                            <div className="item-image-container">
                                <img src={item.imageUrl} alt={item.title} />
                            </div>

                            <div className="item-caption">
                                <div className="item-name">{item.title}</div>

                                <div className="item-number">{`#${(
                                    item.itemIndex + 1
                                )
                                    .toString()
                                    .padStart(5, "0")}`}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className="overlay"
                    ref={overlayRef}
                    onClick={closeExpandedItem}
                ></div>
            </div>

            <div className="project-title">
                <p ref={projectTitleRef}></p>
            </div>

            {activeItemData && (
                <ExpandedItemView
                    data={activeItemData}
                    onStartClose={closeExpandedItem}
                    onAnimationComplete={onExpansionAnimationComplete}
                />
            )}

            <div className="page-vignette-container">
                <div className="page-vignette"></div>

                <div className="page-vignette-strong"></div>

                <div className="page-vignette-extreme"></div>
            </div>
        </>
    );
};

// --- SUBCOMPONENTE PARA O ITEM EXPANDIDO ---

interface ExpandedItemProps {
    data: ActiveItemData;

    onStartClose: () => void;

    onAnimationComplete: () => void;
}

const ExpandedItemView: React.FC<ExpandedItemProps> = ({
    data,
    onStartClose,
    onAnimationComplete,
}) => {
    const itemRef = useRef<HTMLDivElement>(null);

    // --- ALTERAÇÃO FINAL: Lógica de posicionamento vertical corrigida aqui ---

    useEffect(() => {
        const itemEl = itemRef.current;

        if (!itemEl) return;

        const viewportWidth = window.innerWidth;

        const viewportHeight = window.innerHeight;

        const targetWidth = viewportWidth * GALLERY_CONFIG.expandedScale;

        const aspectRatio = data.height / data.width;

        const targetHeight = targetWidth * aspectRatio;

        // Cálculo do offset horizontal

        const offsetX = data.rect.left - (viewportWidth - data.rect.width) / 2;

        // Cálculo corrigido do offset vertical

        const initialCenterY = data.rect.top + data.rect.height / 2;

        const viewportCenterY = viewportHeight / 2;

        const correctedOffsetY = initialCenterY - viewportCenterY;

        gsap.fromTo(
            itemEl,

            {
                width: data.rect.width,

                height: data.rect.height,

                x: offsetX,

                y: correctedOffsetY, // Usando o offset vertical corrigido
            },

            {
                width: targetWidth,

                height: targetHeight,

                x: 0,

                y: 0,

                duration: GALLERY_CONFIG.zoomDuration,

                ease: "hop",
            }
        );
    }, [data]);

    // --- ALTERAÇÃO FINAL: Lógica de posicionamento vertical corrigida aqui também ---

    const handleClose = () => {
        const itemEl = itemRef.current;

        if (!itemEl) return;

        onStartClose();

        const viewportWidth = window.innerWidth;

        const viewportHeight = window.innerHeight;

        // Cálculo do offset horizontal para o retorno

        const offsetX = data.rect.left - (viewportWidth - data.rect.width) / 2;

        // Cálculo corrigido do offset vertical para o retorno

        const initialCenterY = data.rect.top + data.rect.height / 2;

        const viewportCenterY = viewportHeight / 2;

        const correctedOffsetY = initialCenterY - viewportCenterY;

        gsap.to(itemEl, {
            width: data.rect.width,

            height: data.rect.height,

            x: offsetX,

            y: correctedOffsetY, // Usando o offset vertical corrigido

            duration: GALLERY_CONFIG.zoomDuration,

            ease: "hop",

            onComplete: onAnimationComplete,
        });
    };

    return (
        <div className="expanded-item" ref={itemRef} onClick={handleClose}>
            <img src={data.imageUrl} alt={data.title} />
        </div>
    );
};

export default DraggableGallery;
