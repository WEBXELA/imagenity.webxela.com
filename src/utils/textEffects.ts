import { TextEffects } from '../types';

export function generateTextEffectStyles(effects: TextEffects = {}): React.CSSProperties {
  const styles: React.CSSProperties = {};
  const textShadows: string[] = [];

  // Handle shadow effect
  if (effects.shadow) {
    const { color, blur, offsetX, offsetY } = effects.shadow;
    textShadows.push(`${offsetX}px ${offsetY}px ${blur}px ${color}`);
  }

  // Handle neon effect
  if (effects.neon) {
    const { color, blur, intensity } = effects.neon;
    for (let i = 1; i <= intensity; i++) {
      textShadows.push(`0 0 ${i * blur}px ${color}`);
    }
  }

  // Handle echo effect
  if (effects.echo) {
    const { count, distance, opacity } = effects.echo;
    
    for (let i = 1; i <= count; i++) {
      const offset = i * distance;
      const currentOpacity = opacity * (1 - (i / (count + 1)));
      
      // Create echo in all four directions
      textShadows.push(
        `${offset}px ${offset}px 0 rgba(0, 0, 0, ${currentOpacity})`,
        `${-offset}px ${offset}px 0 rgba(0, 0, 0, ${currentOpacity})`,
        `${-offset}px ${-offset}px 0 rgba(0, 0, 0, ${currentOpacity})`,
        `${offset}px ${-offset}px 0 rgba(0, 0, 0, ${currentOpacity})`
      );
    }
  }

  // Combine all text shadows
  if (textShadows.length > 0) {
    styles.textShadow = textShadows.join(', ');
  }

  // Handle outline effect
  if (effects.outline) {
    const { width, color } = effects.outline;
    styles.WebkitTextStroke = `${width}px ${color}`;
    styles.textStroke = `${width}px ${color}`;
  }

  // Handle gradient effect
  if (effects.gradient?.colors?.length >= 2) {
    const { colors, angle = 45 } = effects.gradient;
    styles.backgroundImage = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
    styles.WebkitBackgroundClip = 'text';
    styles.WebkitTextFillColor = 'transparent';
    styles.backgroundClip = 'text';
  }

  return styles;
}