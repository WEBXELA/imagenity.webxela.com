export function copyComputedStyles(target: HTMLElement, source: HTMLElement) {
  const computedStyle = window.getComputedStyle(source);
  
  // Copy all styles
  Array.from(computedStyle).forEach(property => {
    target.style.setProperty(
      property,
      computedStyle.getPropertyValue(property),
      computedStyle.getPropertyPriority(property)
    );
  });

  // Ensure text effects are explicitly copied
  target.style.textShadow = computedStyle.textShadow;
  target.style.webkitTextStroke = computedStyle.webkitTextStroke;
  target.style.backgroundImage = computedStyle.backgroundImage;
  target.style.webkitBackgroundClip = computedStyle.webkitBackgroundClip;
  target.style.webkitTextFillColor = computedStyle.webkitTextFillColor;
  target.style.color = computedStyle.color;
}