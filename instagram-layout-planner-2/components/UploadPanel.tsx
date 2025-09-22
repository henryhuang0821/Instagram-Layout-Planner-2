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

export const UploadPanel: React.FC<UploadPanelProps> = ({ images, onTriggerUpload, onDragStart, onDelete, onDragEnd }) => {
  return (
    <aside className="w-1/4 max-w-xs h-full bg-gray-900 border-r border-gray-700 flex flex-col p-4 shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-gray-100">Upload Photos</h1>
      <p className="text-sm text-gray-400 mb-6">Drag photos from here to the grid on the right to plan your profile layout.</p>
      
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
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    e.dataTransfer.setDragImage(img, img.clientWidth / 2, img.clientHeight / 2);
                  }
                  e.dataTransfer.setData('text/plain', image.id);
                  onDragStart({ type: 'panel', image, index });
                }}
                onDragEnd={onDragEnd}
                className="relative aspect-square cursor-grab group"
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