// src/components/gallery/ProjectTitle.tsx

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import styles from '../../styles/Gallery.module.css';

// 👇 NOVO TIPO: Aqui ensinamos ao TypeScript que nosso elemento pode ter uma propriedade 'splitInstance'
type HTMLParagraphElementWithSplit = HTMLParagraphElement & {
    splitInstance?: SplitType | null;
};

// A interface que define as funções que o pai pode chamar
export interface ProjectTitleRef {
    animate: (title: string, direction: "in" | "out") => void;
}

// 👇 MUDANÇA AQUI: Trocamos {} por Record<string, never> para indicar que não há props.
const ProjectTitle = forwardRef<ProjectTitleRef, Record<string, never>>((props, ref) => {
    
    // 👇 MUDANÇA AQUI: Usamos nosso novo tipo na referência.
    const titleRef = useRef<HTMLParagraphElementWithSplit>(null);

    useImperativeHandle(ref, () => ({
        animate: (title, direction) => {
            const titleEl = titleRef.current;
            if (!titleEl) return;

            gsap.killTweensOf(titleEl.querySelectorAll(".word"));

            if (direction === "in") {
                titleEl.textContent = title;
                const split = new SplitType(titleEl, { types: "words" });
                
                // 👇 MUDANÇA AQUI: Sem 'any', agora o TypeScript conhece 'splitInstance'.
                titleEl.splitInstance = split;
                
                gsap.fromTo(
                    split.words,
                    { y: "100%", opacity: 0 },
                    { y: "0%", opacity: 1, duration: 1, stagger: 0.05, ease: "power3.out" }
                );
            } else {
                // 👇 MUDANÇA AQUI: Sem 'any'.
                const split = titleEl.splitInstance;
                if (split && split.words) {
                    gsap.to(split.words, {
                        y: "-100%",
                        opacity: 0,
                        duration: 0.6,
                        stagger: 0.05,
                        ease: "power3.in",
                        onComplete: () => {
                            split.revert();
                            // 👇 MUDANÇA AQUI: Sem 'any'.
                            titleEl.splitInstance = null;
                            titleEl.textContent = "";
                        },
                    });
                }
            }
        },
    }));

    return (
        <div className={styles['project-title']}>
            <p ref={titleRef}></p>
        </div>
    );
});

ProjectTitle.displayName = "ProjectTitle";
export default ProjectTitle;