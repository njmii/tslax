import React, { useRef, useState } from 'react';

interface SignatureUploadProps {
  label: string;
  initialDataUrl?: string;
  onSave: (dataUrl: string) => void;
}

export const SignatureUpload: React.FC<SignatureUploadProps> = ({ label, initialDataUrl, onSave }) => {
  const [savedImage, setSavedImage] = useState<string | null>(initialDataUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple threshold to remove white/yellowish background
        // Assumes dark ink on light background
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // If the pixel is light (high RGB values), make it transparent
          if (r > 150 && g > 150 && b > 100) {
            data[i + 3] = 0; // Alpha to 0
          } else {
            // Darken the ink to black for better contrast
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 255;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const processedDataUrl = canvas.toDataURL('image/png');
        setSavedImage(processedDataUrl);
        onSave(processedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const clear = () => {
    setSavedImage(null);
    onSave('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {savedImage ? (
        <div className="border border-gray-300 p-2 rounded-md bg-gray-50 flex flex-col items-center">
          <div className="bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgvwEAeeJjQAwwNMAwNMAwNMAwNMAwNMAwNMAwNMAwNMAwNMExoAADm+gk/vK16VQAAAABJRU5ErkJggg==')]">
             <img src={savedImage} alt={`${label} Signature`} className="max-h-32 object-contain" />
          </div>
          <button
            type="button"
            onClick={clear}
            className="mt-2 text-sm text-tsla-red hover:text-red-700"
          >
            Remove & Upload New
          </button>
        </div>
      ) : (
        <div className="border border-gray-300 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-gray-50">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="signature-upload"
          />
          <label
            htmlFor="signature-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-tsla-red hover:bg-red-700 focus:outline-none"
          >
            Upload Signature Image
          </label>
          <p className="mt-2 text-xs text-gray-500">
            JPG or PNG. White/light backgrounds will be removed automatically.
          </p>
        </div>
      )}
    </div>
  );
};
