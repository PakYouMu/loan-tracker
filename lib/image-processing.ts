import { type Crop } from 'react-image-crop';

// 1. Extract the signature as a standalone file (Blob)
export function getCroppedImg(image: HTMLImageElement, crop: Crop): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas is empty'));
      resolve(blob);
    }, 'image/png');
  });
}

// 2. Create a version of the image with the signature WHITED OUT (for OCR)
export function getMaskedImageBase64(image: HTMLImageElement, crop: Crop): string {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  // Draw original image
  ctx.drawImage(image, 0, 0);

  // Draw White Rectangle over the cropped area (Signature)
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  ctx.fillStyle = 'white';
  ctx.fillRect(
    crop.x * scaleX, 
    crop.y * scaleY, 
    crop.width * scaleX, 
    crop.height * scaleY
  );

  // Return Base64 for OCR API
  return canvas.toDataURL('image/jpeg', 0.7); 
}