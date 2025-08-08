import React from "react";
import { ItemData } from "./gallery.types";
import styles from '../../styles/Gallery.module.css'; // MUDANÇA AQUI

interface GalleryItemProps {
    item: ItemData;
    onClick: (element: HTMLDivElement, itemData: ItemData) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ item, onClick }) => {
    return (
        <div
            className={styles.item} // MUDANÇA AQUI
            style={{
                width: `${item.width}px`,
                height: `${item.height}px`,
                left: `${item.x}px`,
                top: `${item.y}px`,
            }}
            onClick={(e) => onClick(e.currentTarget, item)}
        >
            <div className={styles['item-image-container']}> {/* MUDANÇA AQUI */}
                <img src={item.imageUrl} alt={item.title} />
            </div>
            <div className={styles['item-caption']}> {/* MUDANÇA AQUI */}
                <div className={styles['item-name']}>{item.title}</div> {/* MUDANÇA AQUI */}
                <div className={styles['item-number']}>{`#${(item.itemIndex + 1)
                    .toString()
                    .padStart(5, "0")}`}</div> {/* MUDANÇA AQUI */}
            </div>
        </div>
    );
};

export default GalleryItem;