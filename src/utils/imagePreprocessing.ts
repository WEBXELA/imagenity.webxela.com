interface PreprocessOptions {
  enhanceFaces?: boolean;
  detectFaces?: boolean;
  maxSize?: number;
}

export async function preprocessImage(file: File, options: PreprocessOptions = {}): Promise<File> {
  const { 
    enhanceFaces = true,
    detectFaces = true,
    maxSize = 4 * 1024 * 1024 // 4MB default max size
  } = options;

  // Create canvas and load image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Load image
  const img = await createImageBitmap(file);
  
  // Set canvas size
  let { width, height } = img;
  
  // Scale down if image is too large
  if (file.size > maxSize) {
    const scale = Math.sqrt(maxSize / file.size);
    width *= scale;
    height *= scale;
  }
  
  canvas.width = width;
  canvas.height = height;

  // Draw image
  ctx.drawImage(img, 0, 0, width, height);

  if (enhanceFaces) {
    // Enhance contrast and sharpness for better face detection
    const imageData = ctx.getImageData(0, 0, width, height);
    const enhancedData = enhanceImageData(imageData);
    ctx.putImageData(enhancedData, 0, 0);
  }

  // Convert back to file
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, file.type, 0.9);
  });

  return new File([blob], file.name, { type: file.type });
}

function enhanceImageData(imageData: ImageData): ImageData {
  const data = imageData.data;
  
  // Enhance contrast
  const factor = 1.2; // Contrast factor
  for (let i = 0; i < data.length; i += 4) {
    // Enhance RGB channels
    for (let j = 0; j < 3; j++) {
      const value = data[i + j];
      // Apply contrast enhancement
      data[i + j] = Math.min(255, Math.max(0,
        Math.round(factor * (value - 128) + 128)
      ));
    }
  }

  // Apply sharpening
  const width = imageData.width;
  const sharpenKernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];
  
  const tempData = new Uint8ClampedArray(data);
  
  for (let y = 1; y < imageData.height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += tempData[idx] * sharpenKernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        const idx = (y * width + x) * 4 + c;
        data[idx] = Math.min(255, Math.max(0, sum));
      }
    }
  }

  return imageData;
}