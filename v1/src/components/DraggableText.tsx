import React, { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { TextElement } from '../types';
import { generateTextEffectStyles } from '../utils/textEffects';

interface DraggableTextProps {
  text: TextElement;
  onSelect: (text: TextElement) => void;
  onMove: (id: string, x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isSelected: boolean;
  style?: React.CSSProperties;
}

export function DraggableText({
  text,
  onSelect,
  onMove,
  containerRef,
  isSelected,
  style = {}
}: DraggableTextProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const effectStyles = generateTextEffectStyles(text.effects || {});

  if (!text.isVisible) {
    return null;
  }

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(data.x, containerRect.width - (nodeRef.current?.offsetWidth || 0)));
      const y = Math.max(0, Math.min(data.y, containerRect.height - (nodeRef.current?.offsetHeight || 0)));
      onMove(text.id, x, y);
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: text.x, y: text.y }}
      onDrag={handleDrag}
      bounds="parent"
      handle=".drag-handle"
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-move select-none ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(text);
        }}
        data-draggable="true"
        data-text-id={text.id}
        style={{
          ...effectStyles,
          ...style,
          fontFamily: `"${text.fontFamily}", sans-serif`,
          fontSize: `${text.fontSize}px`,
          color: text.color,
          fontWeight: text.isBold ? 'bold' : 'normal',
          fontStyle: text.isItalic ? 'italic' : 'normal',
          textDecoration: text.isUnderline ? 'underline' : 'none',
          lineHeight: 1,
          backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        <div className="drag-handle absolute inset-0" />
        {text.text}
      </div>
    </Draggable>
  );
}