import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  label: string;
  initialDataUrl?: string;
  onSave: (dataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ label, initialDataUrl, onSave }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [savedImage, setSavedImage] = useState<string | null>(initialDataUrl || null);

  const clear = () => {
    sigCanvas.current?.clear();
    setSavedImage(null);
    onSave('');
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      setSavedImage(dataUrl);
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {savedImage ? (
        <div className="border border-gray-300 p-2 rounded-md bg-gray-50 flex flex-col items-center">
          <img src={savedImage} alt={`${label} Signature`} className="max-h-32 object-contain" />
          <button
            type="button"
            onClick={clear}
            className="mt-2 text-sm text-tsla-red hover:text-red-700"
          >
            Clear and Re-draw
          </button>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              className: 'signature-canvas w-full h-40 bg-white cursor-crosshair',
            }}
          />
          <div className="flex justify-end p-2 bg-gray-50 border-t border-gray-200 space-x-2">
            <button
              type="button"
              onClick={clear}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={save}
              className="px-3 py-1 text-sm border border-transparent rounded-md text-white bg-tsla-red hover:bg-red-700"
            >
              Save Signature
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
