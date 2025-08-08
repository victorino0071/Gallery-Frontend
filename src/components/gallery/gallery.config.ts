// Em components/gallery/gallery.config.ts
import { StaticImageData } from 'next/image';
import { ItemSize } from './gallery.types';



// --- DADOS E CONFIGURAções FIXAS ---

export const projectItems = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10"
    
];

export const imageUrls = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png',
    '/images/6.png',
    '/images/7.png',
    '/images/8.png',
    '/images/9.png',
    '/images/10png',

];

export const GALLERY_CONFIG = {
    baseWidth: 550,        // Largura fixa para todos os itens. Ajuste conforme necessário.
    
    // Alturas calculadas para manter a proporção das imagens originais
    smallHeight: 603,      // Altura correspondente à imagem de 934x1024
    largeHeight: 391, 
    itemGap: 65,
    hoverScale: 1.05,
    expandedScale: 0.4,
    expandedScaleLarge: 0.65,
    dragEase: 0.075,
    momentumFactor: 200,
    bufferZone: 3,
    zoomDuration: 0.8,
    overlayOpacity: 0.9,
    overlayDuration: 0.6,
};

export const itemSizes: ItemSize[] = [
    { width: GALLERY_CONFIG.baseWidth, height: GALLERY_CONFIG.smallHeight },
    { width: GALLERY_CONFIG.baseWidth, height: GALLERY_CONFIG.largeHeight },
];

// --- FUNÇÃO AUXILIAR ---
export const trueMod = (n: number, max: number) => ((n % max) + max) % max;