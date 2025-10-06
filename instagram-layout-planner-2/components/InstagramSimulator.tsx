
import React, { useState, useRef, useEffect } from 'react';
import type { Image, DragItem, ProfileData, StoryHighlight } from '../types';
import { Icon } from './Icon';
import { IconName } from '../types';

interface InlineEditProps {
    value: string;
    onSave: (value: string) => void;
    as?: 'input' | 'textarea';
    className?: string;
    inputClassName?: string;
}

const InlineEdit: React.FC<InlineEditProps> = ({ value, onSave, as = 'input', className = '', inputClassName = '' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);
    // FIX: Use separate refs for input and textarea to solve type incompatibility.
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing) {
            // FIX: Use the correct ref based on the `as` prop to focus/select.
            if (as === 'textarea') {
                textareaRef.current?.focus();
            } else {
                inputRef.current?.focus();
                inputRef.current?.select();
            }
        }
    }, [isEditing, as]);

    useEffect(() => {
        setText(value);
    }, [value]);

    const handleSave = () => {
        // Only save if the value has actually changed
        if (text !== value) {
            onSave(text);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && as !== 'textarea') {
            handleSave();
        } else if (e.key === 'Escape') {
            setText(value); // Revert changes
            setIsEditing(false);
        }
    };

    if (isEditing) {
        // FIX: Remove ref from commonProps to apply it directly to the element.
        const commonProps = {
            value: text,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setText(e.target.value),
            onBlur: handleSave,
            onKeyDown: handleKeyDown,
            className: `bg-white border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 relative ${inputClassName}`,
            onClick: (e: React.MouseEvent) => e.stopPropagation(), // Prevent re-triggering edit on click
        };

        return as === 'textarea' ? (
            // FIX: Pass the specific textarea ref.
            <textarea {...commonProps} ref={textareaRef} rows={4} className={`${commonProps.className} w-full p-1`}></textarea>
        ) : (
            // FIX: Pass the specific input ref.
            <input type="text" {...commonProps} ref={inputRef} className={`${commonProps.className} w-full p-1`} />
        );
    }

    return (
        <div onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className={`cursor-pointer rounded-md hover:bg-gray-100 transition-colors p-0.5 -m-0.5 ${className}`}>
            {value || '...'}
        </div>
    );
};


interface ProfileHeaderProps {
  profileData: ProfileData;
  onProfileUpdate: (newProfileData: Partial<ProfileData>) => void;
  onTriggerAvatarUpload: () => void;
}

// Helper components defined in the same file to avoid unmounting on re-render.
const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(({ profileData, onProfileUpdate, onTriggerAvatarUpload }) => (
  <div className="px-4 py-4">
    {/* Profile picture and stats */}
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <button onClick={onTriggerAvatarUpload} className="relative group rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500" aria-label="Change profile picture">
          <img className="w-20 h-20 object-cover rounded-full" src={profileData.avatar} alt="Profile Avatar" />
           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
              </svg>
           </div>
        </button>
      </div>
      <div className="flex-1 flex justify-around text-center ml-4 text-sm">
        <div className="w-1/3">
          <InlineEdit 
            value={profileData.posts}
            onSave={(newValue) => onProfileUpdate({ posts: newValue })}
            className="font-semibold text-center"
            inputClassName="text-center"
          />
          <div className="text-gray-500">posts</div>
        </div>
        <div className="w-1/3">
          <InlineEdit 
            value={profileData.followers}
            onSave={(newValue) => onProfileUpdate({ followers: newValue })}
            className="font-semibold text-center"
            inputClassName="text-center"
          />
          <div className="text-gray-500">followers</div>
        </div>
        <div className="w-1/3">
          <InlineEdit 
            value={profileData.following}
            onSave={(newValue) => onProfileUpdate({ following: newValue })}
            className="font-semibold text-center"
            inputClassName="text-center"
          />
          <div className="text-gray-500">following</div>
        </div>
      </div>
    </div>

    {/* Bio section */}
    <div className="pt-4 text-sm space-y-0.5">
      <InlineEdit
        value={profileData.name}
        onSave={(newValue) => onProfileUpdate({ name: newValue })}
        className="font-semibold"
      />
       <InlineEdit
        value={profileData.category}
        onSave={(newValue) => onProfileUpdate({ category: newValue })}
        className="text-gray-500"
      />
      <div style={{ whiteSpace: 'pre-wrap' }}>
        <InlineEdit
            as="textarea"
            value={profileData.bio}
            onSave={(newValue) => onProfileUpdate({ bio: newValue })}
        />
      </div>
       <InlineEdit
        value={profileData.link}
        onSave={(newValue) => onProfileUpdate({ link: newValue })}
        className="text-blue-500 font-semibold"
      />
    </div>
    
    {/* Action buttons section */}
    <div className="flex items-center space-x-2 pt-3 text-sm">
      <button className="flex-1 font-semibold bg-gray-200 text-black py-1.5 rounded-lg hover:bg-gray-300 transition-colors">Share profile</button>
      <button className="p-1.5 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
        <Icon name={IconName.More} className="w-5 h-5 text-black" />
      </button>
    </div>
  </div>
));

interface StoryHighlightsProps {
  highlights: StoryHighlight[];
  onHighlightUpdate: (highlightId: string, updatedData: Partial<StoryHighlight>) => void;
  onTriggerHighlightImageUpload: (highlightId: string) => void;
}

const StoryHighlights: React.FC<StoryHighlightsProps> = React.memo(({ highlights, onHighlightUpdate, onTriggerHighlightImageUpload }) => (
  <div className="px-4 py-3 flex space-x-4 overflow-x-auto">
    {highlights.map((highlight) => (
      <div key={highlight.id} className="flex-shrink-0 text-center w-16">
        <button
          onClick={() => onTriggerHighlightImageUpload(highlight.id)}
          className="relative group w-16 h-16 rounded-full bg-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500"
          aria-label={`Change image for highlight ${highlight.name}`}
        >
          <img src={highlight.imageSrc} alt={highlight.name} className="rounded-full w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
            </svg>
          </div>
        </button>
        <div className="text-xs mt-1">
          <InlineEdit
            value={highlight.name}
            onSave={(newValue) => onHighlightUpdate(highlight.id, { name: newValue })}
            className="text-center"
            inputClassName="text-xs text-center"
          />
        </div>
      </div>
    ))}
  </div>
));

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

const PhotoGridCell: React.FC<{
  image: Image | null;
  index: number;
  onDragStart: (item: DragItem) => void;
  onDelete: (index: number) => void;
  onDragEnd: () => void;
  onGridUpload: (index: number) => void;
}> = React.memo(({ image, index, onDragStart, onDelete, onDragEnd, onGridUpload }) => {
  const cellClasses = `relative aspect-[4/5] bg-gray-200 group transition duration-150 ease-in-out`;

  return (
    <div
      data-index={index}
      className={cellClasses}
    >
      {image ? (
        <>
          <img
            src={image.src}
            alt={`grid item ${index}`}
            className="w-full h-full object-cover cursor-grab transition-opacity"
            draggable
            onDragStart={(e) => {
              const img = e.target as HTMLImageElement;
              
              const dragPreview = createDragPreview();
              document.body.appendChild(dragPreview);
              e.dataTransfer.setDragImage(dragPreview, 25, 25);
              
              setTimeout(() => document.body.removeChild(dragPreview), 0);
              
              e.dataTransfer.setData('text/plain', image.id);
              onDragStart({ type: 'grid', image, index });
              
              setTimeout(() => {
                img.classList.add('opacity-40');
              }, 0);
            }}
            onDragEnd={(e) => {
                const img = e.target as HTMLImageElement;
                img.classList.remove('opacity-40');
                onDragEnd();
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
            <button
              onClick={() => onDelete(index)}
              className="absolute top-1 right-1 h-6 w-6 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-auto"
              aria-label="Remove image from grid"
            >
             <Icon name={IconName.Close} className="w-3 h-3"/>
            </button>
          </div>
        </>
      ) : (
        <button 
            onClick={() => onGridUpload(index)}
            className="w-full h-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label={`Upload photo to grid position ${index + 1}`}
        >
            <Icon name={IconName.Add} className="w-8 h-8 text-gray-500"/>
        </button>
      )}
    </div>
  );
});

const BottomNav: React.FC<{ avatarUrl: string }> = React.memo(({ avatarUrl }) => (
    <div className="flex justify-around items-center h-12 border-t border-gray-200 bg-white">
        <Icon name={IconName.Home} />
        <Icon name={IconName.Search} />
        <Icon name={IconName.Reels} />
        <Icon name={IconName.Shop} />
        <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 rounded-full">
            <img src={avatarUrl} alt="Profile" className="h-7 w-7 rounded-full object-cover" />
        </button>
    </div>
));

interface InstagramSimulatorProps {
  gridImages: (Image | null)[];
  onDragStart: (item: DragItem) => void;
  onDrop: (targetIndex: number) => void;
  onDelete: (index: number) => void;
  onDragEnd: () => void;
  onGridUpload: (index: number) => void;
  profileData: ProfileData;
  onProfileUpdate: (newProfileData: Partial<ProfileData>) => void;
  onTriggerAvatarUpload: () => void;
  onHighlightUpdate: (highlightId: string, updatedData: Partial<StoryHighlight>) => void;
  onTriggerHighlightImageUpload: (highlightId: string) => void;
}

export const InstagramSimulator: React.FC<InstagramSimulatorProps> = ({ 
  gridImages, 
  onDragStart, 
  onDrop, 
  onDelete, 
  onDragEnd, 
  onGridUpload, 
  profileData, 
  onProfileUpdate, 
  onTriggerAvatarUpload,
  onHighlightUpdate,
  onTriggerHighlightImageUpload 
}) => {
  const [activeTab, setActiveTab] = useState('grid');
  const dragOverCellRef = useRef<HTMLElement | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');

    if (cell && cell !== dragOverCellRef.current) {
        dragOverCellRef.current?.classList.remove('drag-over');
        cell.classList.add('drag-over');
        dragOverCellRef.current = cell;
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      if (dragOverCellRef.current && !e.currentTarget.contains(e.relatedTarget as Node)) {
          dragOverCellRef.current.classList.remove('drag-over');
          dragOverCellRef.current = null;
      }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (dragOverCellRef.current) {
          dragOverCellRef.current.classList.remove('drag-over');
          const targetIndex = parseInt(dragOverCellRef.current.dataset.index || '-1', 10);
          if (targetIndex !== -1) {
              onDrop(targetIndex);
          }
          dragOverCellRef.current = null;
      }
  };

  return (
    <div className="w-full max-w-md h-[90vh] max-h-[850px] bg-white text-black rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans relative border border-gray-300">
        <div className="h-12 flex justify-between items-center px-4 border-b border-gray-200">
            <div className="w-1/4"></div>
            <div className="w-1/2 text-center font-bold">
                 <InlineEdit 
                    value={profileData.username}
                    onSave={(newValue) => onProfileUpdate({ username: newValue })}
                    className="font-bold text-center"
                    inputClassName="text-center font-bold"
                />
            </div>
            <div className="w-1/4"></div>
        </div>
        <div className="flex-1 overflow-y-auto">
            <ProfileHeader 
                profileData={profileData} 
                onProfileUpdate={onProfileUpdate}
                onTriggerAvatarUpload={onTriggerAvatarUpload}
            />
            <StoryHighlights 
                highlights={profileData.highlights}
                onHighlightUpdate={onHighlightUpdate}
                onTriggerHighlightImageUpload={onTriggerHighlightImageUpload}
            />
            <div className="flex justify-around border-t border-gray-200">
                <button 
                    className={`flex-1 py-3 flex justify-center transition-colors ${activeTab === 'grid' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`} 
                    onClick={() => setActiveTab('grid')}>
                    <Icon name={IconName.Grid} />
                </button>
                <button 
                    className={`flex-1 py-3 flex justify-center transition-colors ${activeTab === 'reels' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`} 
                    onClick={() => setActiveTab('reels')}>
                    <Icon name={IconName.Reels} />
                </button>
                <button 
                    className={`flex-1 py-3 flex justify-center transition-colors ${activeTab === 'tagged' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`} 
                    onClick={() => setActiveTab('tagged')}>
                    <Icon name={IconName.Tagged} />
                </button>
            </div>
            
            <div 
              className="grid grid-cols-3 gap-0.5"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
                {gridImages.map((image, index) => (
                <PhotoGridCell
                    key={index}
                    image={image}
                    index={index}
                    onDragStart={onDragStart}
                    onDelete={onDelete}
                    onDragEnd={onDragEnd}
                    onGridUpload={onGridUpload}
                />
                ))}
            </div>
        </div>
         <BottomNav avatarUrl={profileData.avatar} />
    </div>
  );
};