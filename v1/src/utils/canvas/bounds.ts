export interface Bounds {
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export function calculateBounds(container: HTMLElement): Bounds {
  const rect = container.getBoundingClientRect();
  const textElements = container.querySelectorAll('[data-draggable="true"]');
  
  let bounds: Bounds = {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height
  };

  textElements.forEach(element => {
    const elementRect = element.getBoundingClientRect();
    bounds.left = Math.min(bounds.left, elementRect.left);
    bounds.top = Math.min(bounds.top, elementRect.top);
    bounds.right = Math.max(bounds.right, elementRect.right);
    bounds.bottom = Math.max(bounds.bottom, elementRect.bottom);
  });

  // Add padding
  const padding = 20;
  bounds.left -= padding;
  bounds.top -= padding;
  bounds.right += padding;
  bounds.bottom += padding;
  bounds.width = bounds.right - bounds.left;
  bounds.height = bounds.bottom - bounds.top;

  return bounds;
}