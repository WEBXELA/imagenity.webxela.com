import { ImageData } from './types';

export function enhanceImage(imageData: ImageData): ImageData {
  const enhanced = new Uint8ClampedArray(imageData.data);
  
  // Apply multiple enhancement steps
  equalizeHistogram(enhanced);
  adjustContrast(enhanced, 1.2);
  sharpenImage(enhanced, imageData.width, imageData.height);
  reduceNoise(enhanced, imageData.width);
  
  return new ImageData(enhanced, imageData.width, imageData.height);
}

function equalizeHistogram(data: Uint8ClampedArray): void {
  const histogram = new Array(256).fill(0);
  const totalPixels = data.length / 4;
  
  // Build histogram
  for (let i = 0; i < data.length; i += 4) {
    const brightness = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    histogram[brightness]++;
  }
  
  // Calculate cumulative distribution
  const cdf = new Array(256).fill(0);
  cdf[0] = histogram[0];
  for (let i = 1; i < 256; i++) {
    cdf[i] = cdf[i - 1] + histogram[i];
  }
  
  // Normalize CDF
  const cdfMin = cdf.find(x => x > 0) || 0;
  for (let i = 0; i < 256; i++) {
    cdf[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
  }
  
  // Apply equalization
  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = cdf[data[i + j]];
    }
  }
}

function adjustContrast(data: Uint8ClampedArray, factor: number): void {
  const factor128 = 128 * (1 - factor);
  
  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = Math.min(255, Math.max(0,
        Math.round(factor * data[i + j] + factor128)
      ));
    }
  }
}

function sharpenImage(
  data: Uint8ClampedArray,
  width: number,
  height: number
): void {
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];
  
  const temp = new Uint8ClampedArray(data);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += temp[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        const idx = (y * width + x) * 4 + c;
        data[idx] = Math.min(255, Math.max(0, sum));
      }
    }
  }
}

function reduceNoise(data: Uint8ClampedArray, width: number): void {
  const temp = new Uint8ClampedArray(data);
  const windowSize = 3;
  const halfWindow = Math.floor(windowSize / 2);
  
  for (let i = halfWindow * width * 4; i < data.length - halfWindow * width * 4; i += 4) {
    for (let c = 0; c < 3; c++) {
      const values = [];
      
      // Gather values in window
      for (let dy = -halfWindow; dy <= halfWindow; dy++) {
        for (let dx = -halfWindow; dx <= halfWindow; dx++) {
          const idx = i + (dy * width + dx) * 4 + c;
          values.push(temp[idx]);
        }
      }
      
      // Apply median filter
      values.sort((a, b) => a - b);
      data[i + c] = values[Math.floor(values.length / 2)];
    }
  }
}