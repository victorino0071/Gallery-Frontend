// Em components/gallery/gallery.types.ts

export interface ItemSize {
    width: number;
    height: number;
}

export interface ItemData {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    imageUrl: string;
    itemIndex: number;
}

export interface ActiveItemData {
    id: string;
    rect: DOMRect;
    title: string;
    imageUrl: string;
    width: number;
    height: number;
}