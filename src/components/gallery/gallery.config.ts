import { ItemSize } from './gallery.types';



// --- DADOS E CONFIGURAções FIXAS ---

export const projectItems = [
    "lonely road",
    "holding sun",
    "Black Cat",
    "Great Field",
    "cabin in the forest",
    "Owl Face",
    "Building",
    "Green Ocean",
];

export const imageUrls = [
    '/images/1.jpeg',
    '/images/2.jpeg',
    '/images/3.jpeg',
    '/images/4.jpeg',
    '/images/5.jpeg',
    '/images/6.jpeg',
    '/images/7.jpeg',
    '/images/8.jpeg'

];

export const GALLERY_CONFIG = {
    baseWidth: 700,        // Largura fixa para todos os itens. Ajuste conforme necessário.
    
    // Alturas calculadas para manter a proporção das imagens originais
    smallHeight: 800,      // Altura correspondente à imagem de 934x1024
    largeHeight: 500, 
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