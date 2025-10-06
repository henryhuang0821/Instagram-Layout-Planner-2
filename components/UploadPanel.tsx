import React from 'react';
import type { Image, DragItem } from '../types';
import { Icon } from './Icon';
import { IconName } from '../types';

interface UploadPanelProps {
  images: Image[];
  onTriggerUpload: () => void;
  onDragStart: (item: DragItem) => void;
  onDelete: (id: string) => void;
  onDragEnd: () => void;
}

const createDragPreview = (): HTMLElement => {
  const dragPreview = document.createElement('div');
  dragPreview.style.position = 'absolute';
  dragPreview.style.left = '-9999px';
  dragPreview.style.width = '50px';
  dragPreview.style.height = '50px';
  dragPreview.style.backgroundColor = 'rgba(59, 130, 246, 0.7)'; // Tailwind's blue-500 with transparency
  dragPreview.style.borderRadius = '8px';
  dragPreview.style.display = 'flex';
  dragPreview.style.alignItems = 'center';
  dragPreview.style.justifyContent = 'center';
  dragPreview.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

  const iconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  `;
  dragPreview.innerHTML = iconSVG;
  
  return dragPreview;
};


export const UploadPanel: React.FC<UploadPanelProps> = ({ images, onTriggerUpload, onDragStart, onDelete, onDragEnd }) => {
  return (
    <aside className="w-1/4 max-w-xs h-full bg-white border-r border-gray-200 flex flex-col p-4 shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-gray-900">Upload Photos</h1>
      <p className="text-sm text-gray-600 mb-6">Drag photos from here to the grid on the right to plan your profile layout.</p>
      
      <button onClick={onTriggerUpload} className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors duration-200 mb-6">
        Choose Photos
      </button>

      <div className="flex-1 overflow-y-auto pr-2">
        {images.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Your uploaded photos will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => {
                  const draggableElement = e.currentTarget as HTMLDivElement;
                  
                  // Use a lightweight custom drag preview for performance
                  const dragPreview = createDragPreview();
                  document.body.appendChild(dragPreview);
                  e.dataTransfer.setDragImage(dragPreview, 25, 25); // Center the preview on cursor
                  
                  // Cleanup the preview element
                  setTimeout(() => document.body.removeChild(dragPreview), 0);
                  
                  e.dataTransfer.setData('text/plain', image.id);
                  onDragStart({ type: 'panel', image, index });

                  setTimeout(() => {
                    draggableElement.classList.add('opacity-40');
                  }, 0);
                }}
                onDragEnd={(e) => {
                  (e.currentTarget as HTMLDivElement).classList.remove('opacity-40');
                  onDragEnd();
                }}
                className="relative aspect-square cursor-grab group transition-opacity"
              >
                <img src={image.src} alt="uploaded" className="w-full h-full object-cover rounded-md" />
                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center">
                    <button 
                      onClick={() => onDelete(image.id)}
                      className="absolute top-1 right-1 h-6 w-6 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      aria-label="Delete image from panel"
                      >
                       <Icon name={IconName.Close} className="w-3 h-3"/>
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};