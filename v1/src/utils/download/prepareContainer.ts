import { ProcessedImage, TextElement } from '../../types';

export function prepareContainer(width: number, height: number): HTMLDivElement {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: ${width}px;
    height: ${height}px;
    background-color: white;
    overflow: hidden;
  `;
  return container;
}