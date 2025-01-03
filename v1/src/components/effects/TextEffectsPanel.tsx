import React from 'react';
import { TextEffects } from '../../types';
import { Toggle } from '../Toggle';
import { ColorPicker } from '../ColorPicker';

interface TextEffectsPanelProps {
  effects: TextEffects;
  onChange: (effects: TextEffects) => void;
}

export function TextEffectsPanel({ effects = {}, onChange }: TextEffectsPanelProps) {
  const updateEffect = <K extends keyof TextEffects>(
    effectKey: K,
    value: TextEffects[K] | undefined
  ) => {
    const newEffects = { ...effects };
    if (value === undefined) {
      delete newEffects[effectKey];
    } else {
      newEffects[effectKey] = value;
    }
    onChange(newEffects);
  };

  const defaultGradientColors = ['#ff0000', '#0000ff'];
  const gradientColors = effects.gradient?.colors?.length >= 2 
    ? effects.gradient.colors 
    : defaultGradientColors;

  return (
    <div className="space-y-6">
      {/* Shadow Effect */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Shadow</h3>
          <Toggle
            enabled={!!effects.shadow}
            onChange={(enabled) => {
              if (enabled) {
                updateEffect('shadow', {
                  color: '#000000',
                  blur: 4,
                  offsetX: 2,
                  offsetY: 2,
                });
              } else {
                updateEffect('shadow', undefined);
              }
            }}
          />
        </div>
        {effects.shadow && (
          <div className="space-y-2">
            <ColorPicker
              color={effects.shadow.color}
              onChange={(color) =>
                updateEffect('shadow', {
                  ...effects.shadow,
                  color,
                })
              }
              label="Shadow Color"
            />
            <div>
              <label className="block text-sm text-gray-600 mb-1">Blur</label>
              <input
                type="range"
                min="0"
                max="20"
                value={effects.shadow.blur}
                onChange={(e) =>
                  updateEffect('shadow', {
                    ...effects.shadow,
                    blur: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Neon Effect */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Neon</h3>
          <Toggle
            enabled={!!effects.neon}
            onChange={(enabled) => {
              if (enabled) {
                updateEffect('neon', {
                  color: '#ff00ff',
                  blur: 10,
                  intensity: 3,
                });
              } else {
                updateEffect('neon', undefined);
              }
            }}
          />
        </div>
        {effects.neon && (
          <div className="space-y-2">
            <ColorPicker
              color={effects.neon.color}
              onChange={(color) =>
                updateEffect('neon', {
                  ...effects.neon,
                  color,
                })
              }
              label="Neon Color"
            />
            <div>
              <label className="block text-sm text-gray-600 mb-1">Intensity</label>
              <input
                type="range"
                min="1"
                max="5"
                value={effects.neon.intensity}
                onChange={(e) =>
                  updateEffect('neon', {
                    ...effects.neon,
                    intensity: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Outline Effect */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Outline</h3>
          <Toggle
            enabled={!!effects.outline}
            onChange={(enabled) => {
              if (enabled) {
                updateEffect('outline', {
                  color: '#000000',
                  width: 1,
                });
              } else {
                updateEffect('outline', undefined);
              }
            }}
          />
        </div>
        {effects.outline && (
          <div className="space-y-2">
            <ColorPicker
              color={effects.outline.color}
              onChange={(color) =>
                updateEffect('outline', {
                  ...effects.outline,
                  color,
                })
              }
              label="Outline Color"
            />
            <div>
              <label className="block text-sm text-gray-600 mb-1">Width</label>
              <input
                type="range"
                min="1"
                max="10"
                value={effects.outline.width}
                onChange={(e) =>
                  updateEffect('outline', {
                    ...effects.outline,
                    width: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Gradient Effect */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Gradient</h3>
          <Toggle
            enabled={!!effects.gradient}
            onChange={(enabled) => {
              if (enabled) {
                updateEffect('gradient', {
                  colors: defaultGradientColors,
                  angle: 45,
                });
              } else {
                updateEffect('gradient', undefined);
              }
            }}
          />
        </div>
        {effects.gradient && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <ColorPicker
                color={gradientColors[0]}
                onChange={(color) =>
                  updateEffect('gradient', {
                    ...effects.gradient,
                    colors: [color, gradientColors[1]],
                  })
                }
                label="Color 1"
              />
              <ColorPicker
                color={gradientColors[1]}
                onChange={(color) =>
                  updateEffect('gradient', {
                    ...effects.gradient,
                    colors: [gradientColors[0], color],
                  })
                }
                label="Color 2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Angle</label>
              <input
                type="range"
                min="0"
                max="360"
                value={effects.gradient.angle}
                onChange={(e) =>
                  updateEffect('gradient', {
                    ...effects.gradient,
                    angle: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Echo Effect */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Echo</h3>
          <Toggle
            enabled={!!effects.echo}
            onChange={(enabled) => {
              if (enabled) {
                updateEffect('echo', {
                  count: 3,
                  distance: 2,
                  opacity: 0.3,
                });
              } else {
                updateEffect('echo', undefined);
              }
            }}
          />
        </div>
        {effects.echo && (
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Count</label>
              <input
                type="range"
                min="1"
                max="5"
                value={effects.echo.count}
                onChange={(e) =>
                  updateEffect('echo', {
                    ...effects.echo,
                    count: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Distance</label>
              <input
                type="range"
                min="1"
                max="10"
                value={effects.echo.distance}
                onChange={(e) =>
                  updateEffect('echo', {
                    ...effects.echo,
                    distance: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Opacity</label>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.1"
                value={effects.echo.opacity}
                onChange={(e) =>
                  updateEffect('echo', {
                    ...effects.echo,
                    opacity: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}