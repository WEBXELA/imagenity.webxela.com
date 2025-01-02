import React, { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ImageElement } from '../types';

interface DraggableImageProps {
  image: ImageElement;
  onMove: (id: string, x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

export function DraggableImage({
  image,
  onMove,
  containerRef,
  style = {}
}: DraggableImageProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(data.x, containerRect.width - image.width));
      const y = Math.max(0, Math.min(data.y, containerRect.height - image.height));
      onMove(image.id, x, y);
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: image.x, y: image.y }}
      onDrag={handleDrag}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className="absolute cursor-move"
        style={{
          ...style,
          width: image.width,
          height: image.height,
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        <img
          src={image.url}
          alt="Uploaded"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    </Draggable>
  );
}