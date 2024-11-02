import React from 'react';
import { Clipboard as ClipboardIcon } from 'lucide-react';
import { useToast, Notifications } from './Notifications';
import { Trash2
    ,X as CloseIcon
    , ArrowLeft as ArrowLeftIcon
    , ArrowRight as ArrowRightIcon
    , Download as DownloadIcon
} from 'lucide-react';

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  prompt: string;
  onNext: () => void; // Function to go to the next image
  onPrev: () => void; // Function to go to the previous image
};

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, prompt, onNext, onPrev }) => {
  

  if (!isOpen) return null;

  const { toast } = useToast()

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
     // Optional: Notify the user
     toast(
        {title: "Prompt copied to clipboard",
        description: "The prompt has been successfully copied to your clipboard.",
        duration: 2000
    }
     )

  };
  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    console.log("image url /n ", imageUrl )
    link.download = `image-${Date.now()}.jpg`; // Set a default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg relative max-w-lg w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
            <CloseIcon className="h-5 w-5 text-red-500" />
        </button>
        <img src={imageUrl} alt={prompt} className="w-full h-auto rounded-lg mb-4" />
        
        <div className="flex justify-between items-start mt-2">
          <p className="text-gray-800 flex-1">{prompt}</p>
          <button onClick={handleCopyPrompt} className="ml-2 text-gray-600 hover:text-gray-800">
            <ClipboardIcon className="h-6 w-6 bg-slate-200 rounded-sm hover:text-blue-700 py-0 " />
          </button>
        </div>
        <button onClick={handleDownloadImage} className="absolute top-8 right-8 bg-green-400 text-white hover:text-gray-800 rounded-md">
          <DownloadIcon className="h-5 w-5 inline-block m-2" />
        </button>
        
        <div className="flex justify-between mt-4">
          <button onClick={onPrev} className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400">
            <ArrowLeftIcon className="h-5 w-5" /> 
          </button>
          <button onClick={onNext} className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400">
             <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
        
      </div>
     
      <Notifications />
    </div>
  );
}; 