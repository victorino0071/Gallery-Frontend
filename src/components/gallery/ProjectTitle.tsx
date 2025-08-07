// Em components/gallery/ProjectTitle.tsx

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import styles from '../../styles/Gallery.module.css'; // Adicionamos a importação

// A interface que define as funções que o pai pode chamar
export interface ProjectTitleRef {
    animate: (title: string, direction: "in" | "out") => void;
}

const ProjectTitle = forwardRef<ProjectTitleRef, {}>((props, ref) => {
    const titleRef = useRef<HTMLParagraphElement>(null);

    useImperativeHandle(ref, () => ({
        animate: (title, direction) => {
            const titleEl = titleRef.current;
            if (!titleEl) return;

            // A lógica de animação permanece a mesma.
            // O seletor '.word' é adicionado pela biblioteca SplitType e não precisa ser alterado.
            gsap.killTweensOf(titleEl.querySelectorAll(".word"));

            if (direction === "in") {
                titleEl.textContent = title;
                const split = new SplitType(titleEl, { types: "words" });
                (titleEl as any).splitInstance = split;
                gsap.fromTo(
                    split.words,
                    { y: "100%", opacity: 0 },
                    { y: "0%", opacity: 1, duration: 1, stagger: 0.05, ease: "power3.out" }
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
        },
    }));

    return (
        <div className={styles['project-title']}> {/* A classe foi atualizada aqui */}
            <p ref={titleRef}></p>
        </div>
    );
});

ProjectTitle.displayName = "ProjectTitle"; // Bom para debugging
export default ProjectTitle;