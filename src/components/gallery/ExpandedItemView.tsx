import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ActiveItemData } from "./gallery.types";
import { GALLERY_CONFIG } from "./gallery.config";
import styles from "../../styles/Gallery.module.css" // Já estava aqui, agora vamos usar!


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

    // useEffect e handleClose (sem alterações na lógica)
    useEffect(() => {
        const itemEl = itemRef.current;
        if (!itemEl) return;

        const targetScale =
            data.height === GALLERY_CONFIG.largeHeight
                ? GALLERY_CONFIG.expandedScaleLarge
                : GALLERY_CONFIG.expandedScale;
        
        const viewportWidth = window.innerWidth;
        const targetWidth = viewportWidth * targetScale;
        const aspectRatio = data.height / data.width;
        const targetHeight = targetWidth * aspectRatio;

        gsap.to(itemEl, {
            top: "50%",
            left: "50%",
            width: targetWidth,
            height: targetHeight,
            xPercent: -50,
            yPercent: -50,
            duration: GALLERY_CONFIG.zoomDuration,
            ease: "hop",
        });
    }, [data]);

    const handleClose = () => {
        const itemEl = itemRef.current;
        if (!itemEl) return;
        onStartClose();
        gsap.to(itemEl, {
            top: data.rect.top,
            left: data.rect.left,
            width: data.rect.width,
            height: data.rect.height,
            xPercent: 0,
            yPercent: 0,
            duration: GALLERY_CONFIG.zoomDuration,
            ease: "hop",
            onComplete: onAnimationComplete,
        });
    };

    return (
        <div
            className={styles['expanded-item']} // MUDANÇA AQUI
            ref={itemRef}
            onClick={handleClose}
            style={{
                position: "fixed",
                top: `${data.rect.top}px`,
                left: `${data.rect.left}px`,
                width: `${data.rect.width}px`,
                height: `${data.rect.height}px`,
            }}
        >
            <img src={data.imageUrl} alt={data.title}/>
        </div>
    );
};

export default ExpandedItemView;