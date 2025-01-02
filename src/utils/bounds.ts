interface Bounds {
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export function calculateContentBounds(containerRect: DOMRect, elements: NodeListOf<Element>): Bounds {
  let bounds = {
    left: containerRect.left,
    top: containerRect.top,
    right: containerRect.right,
    bottom: containerRect.bottom,
    width: containerRect.width,
    height: containerRect.height
  };

  // Include all text elements in bounds calculation
  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    bounds.left = Math.min(bounds.left, rect.left);
    bounds.top = Math.min(bounds.top, rect.top);
    bounds.right = Math.max(bounds.right, rect.right);
    bounds.bottom = Math.max(bounds.bottom, rect.bottom);
  });

  // Update width and height based on bounds
  bounds.width = bounds.right - bounds.left;
  bounds.height = bounds.bottom - bounds.top;

  return bounds;
}