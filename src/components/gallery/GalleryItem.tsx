// Em components/gallery/GalleryItem.tsx

import React from "react";
import { ItemData } from "./gallery.types";

interface GalleryItemProps {
    item: ItemData;
    isVisible: boolean;
    onClick: (element: HTMLDivElement, itemData: ItemData) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ item, isVisible, onClick }) => {
    return (
        <div
            className="item"
            style={{
                width: `${item.width}px`,
                height: `${item.height}px`,
                left: `${item.x}px`,
                top: `${item.y}px`,
                opacity: isVisible ? 1 : 0,
            }}
            onClick={(e) => onClick(e.currentTarget, item)}
        >
            <div className="item-image-container">
                <img src={item.imageUrl} alt={item.title} />
            </div>
            <div className="item-caption">
                <div className="item-name">{item.title}</div>
                <div className="item-number">{`#${(item.itemIndex + 1)
                    .toString()
                    .padStart(5, "0")}`}</div>
            </div>
        </div>
    );
};

export default GalleryItem;