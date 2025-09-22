import React, { useState, useRef, useCallback } from 'react';
import { UploadPanel } from './components/UploadPanel';
import { InstagramSimulator } from './components/InstagramSimulator';
import type { Image, DragItem, ProfileData, StoryHighlight } from './types';

const App: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [gridImages, setGridImages] = useState<(Image | null)[]>(Array(18).fill(null));
  const [uploadTargetIndex, setUploadTargetIndex] = useState<number | null>(null);
  const [imageUploadTarget, setImageUploadTarget] = useState<'avatar' | { type: 'highlight', id: string } | null>(null);


  const [profileData, setProfileData] = useState<ProfileData>({
    username: 'your_username',
    avatar: 'https://picsum.photos/id/237/200/200',
    posts: '18',
    followers: '1.2M',
    following: '321',
    name: 'Your Name',
    category: 'Category/Genre',
    bio: `Bio line 1 describing your amazing profile. ✨
Link in bio! 👇`,
    link: 'your.link/goes-here',
    highlights: Array.from({ length: 5 }).map((_, i) => ({
      id: `highlight-${i + 1}`,
      imageSrc: `https://picsum.photos/id/${10 + i}/100/100`,
      name: `Highlight ${i + 1}`,
    })),
  });

  const draggedItemRef = useRef<DragItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleImageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      
      const processFile = (file: File, callback: (image: Image) => void) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const newImage: Image = {
              id: `${file.name}-${Date.now()}`,
              src: e.target.result as string,
            };
            callback(newImage);
          }
        };
        reader.readAsDataURL(file);
      };

      // If upload was triggered from a specific grid cell
      if (uploadTargetIndex !== null) {
        const targetFile = filesArray.shift(); // Take the first file for the grid
        if(targetFile) {
            processFile(targetFile, (newImage) => {
                setGridImages(currentGridImages => {
                    const newGridImages = [...currentGridImages];
                    const imageBeingReplaced = newGridImages[uploadTargetIndex];
                    newGridImages[uploadTargetIndex] = newImage;

                    // If an image was replaced, move it back to the panel
                    if (imageBeingReplaced) {
                        setUploadedImages(prev => {
                            if (!prev.some(img => img.id === imageBeingReplaced.id)) {
                                return [...prev, imageBeingReplaced];
                            }
                            return prev;
                        });
                    }
                    return newGridImages;
                });
            });
        }
      }
      
      // Process remaining files (or all files if triggered from panel)
      filesArray.forEach(file => {
        processFile(file, (newImage) => {
          setUploadedImages(prev => [...prev, newImage]);
        });
      });
    }
    // Reset the target index after processing
    setUploadTargetIndex(null);
  };
  
  const triggerUpload = useCallback((targetIndex: number | null = null) => {
    setUploadTargetIndex(targetIndex);
    if(fileInputRef.current) {
        fileInputRef.current.value = ''; // Allow re-uploading the same file
        fileInputRef.current.click();
    }
  }, []);

  const handleProfileUpdate = useCallback((newProfileData: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...newProfileData }));
  }, []);

  const handleHighlightUpdate = useCallback((highlightId: string, updatedData: Partial<StoryHighlight>) => {
    setProfileData(prev => ({
        ...prev,
        highlights: prev.highlights.map(h => 
            h.id === highlightId ? { ...h, ...updatedData } : h
        )
    }));
  }, []);

  const handleSingleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!imageUploadTarget) return;

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newImageSrc = e.target.result as string;
          if (imageUploadTarget === 'avatar') {
            handleProfileUpdate({ avatar: newImageSrc });
          } else if (imageUploadTarget.type === 'highlight') {
            handleHighlightUpdate(imageUploadTarget.id, { imageSrc: newImageSrc });
          }
        }
        setImageUploadTarget(null); // Reset target
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAvatarUpload = useCallback(() => {
    setImageUploadTarget('avatar');
    if(singleImageInputRef.current) {
        singleImageInputRef.current.value = '';
        singleImageInputRef.current.click();
    }
  }, []);

  const triggerHighlightImageUpload = useCallback((highlightId: string) => {
    setImageUploadTarget({ type: 'highlight', id: highlightId });
    if(singleImageInputRef.current) {
        singleImageInputRef.current.value = '';
        singleImageInputRef.current.click();
    }
  }, []);


  const handleDragStart = useCallback((item: DragItem) => {
    draggedItemRef.current = item;
  }, []);

  const handleDragEnd = useCallback(() => {
    draggedItemRef.current = null;
  }, []);

  const handleDrop = useCallback((targetIndex: number) => {
    if (!draggedItemRef.current) return;

    const draggedItem = draggedItemRef.current;
    
    if (draggedItem.type === 'grid') {
      const sourceIndex = draggedItem.index;
      if (sourceIndex === targetIndex) return;

      setGridImages(currentGridImages => {
          const newGridImages = [...currentGridImages];
          [newGridImages[sourceIndex], newGridImages[targetIndex]] = [newGridImages[targetIndex], newGridImages[sourceIndex]];
          return newGridImages;
      });

    } else if (draggedItem.type === 'panel') {
      const draggedImage = draggedItem.image;
      
      setGridImages(currentGridImages => {
        const newGridImages = [...currentGridImages];
        const imageBeingReplaced = newGridImages[targetIndex];
        newGridImages[targetIndex] = draggedImage;
        
        setUploadedImages(currentUploaded => {
            let nextUploaded = currentUploaded.filter(img => img.id !== draggedImage.id);
            if (imageBeingReplaced && !nextUploaded.some(img => img.id === imageBeingReplaced.id)) {
                nextUploaded.push(imageBeingReplaced);
            }
            return nextUploaded;
        });

        return newGridImages;
      });
    }
  }, []);

  const handleDeleteFromGrid = useCallback((index: number) => {
    setGridImages(currentGridImages => {
        const imageToMove = currentGridImages[index];
        if (!imageToMove) return currentGridImages;

        const newGridImages = [...currentGridImages];
        newGridImages[index] = null;
        
        setUploadedImages(prev => {
            if (prev.some(img => img.id === imageToMove.id)) {
                return prev;
            }
            return [...prev, imageToMove];
        });
        return newGridImages;
    });
  }, []);

  const handleDeleteFromPanel = useCallback((id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white font-sans overflow-hidden">
      <input 
        id="file-upload" 
        type="file" 
        multiple 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload}
        ref={fileInputRef}
      />
      <input 
        id="single-image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSingleImageUpload}
        ref={singleImageInputRef}
      />
      <UploadPanel 
        images={uploadedImages} 
        onTriggerUpload={() => triggerUpload(null)}
        onDragStart={handleDragStart}
        onDelete={handleDeleteFromPanel}
        onDragEnd={handleDragEnd}
      />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <InstagramSimulator 
          gridImages={gridImages}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={handleDeleteFromGrid}
          onDragEnd={handleDragEnd}
          onGridUpload={triggerUpload}
          profileData={profileData}
          onProfileUpdate={handleProfileUpdate}
          onTriggerAvatarUpload={triggerAvatarUpload}
          onHighlightUpdate={handleHighlightUpdate}
          onTriggerHighlightImageUpload={triggerHighlightImageUpload}
        />
      </main>
    </div>
  );
};

export default App;