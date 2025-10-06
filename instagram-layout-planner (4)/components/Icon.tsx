
import React from 'react';
import { IconName } from '../types';

interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = "h-6 w-6" }) => {
  // FIX: Use React.ReactElement instead of JSX.Element to resolve "Cannot find namespace 'JSX'" error.
  const icons: { [key in IconName]: React.ReactElement } = {
    [IconName.Home]: (
      <svg aria-label="Home" fill="currentColor" role="img" viewBox="0 0 24 24" className={className}>
        <path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h5V11.543l-8.426-8.159a.998.998 0 0 0-1.148 0L2 11.543V22h5v-5.455Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    ),
    [IconName.Search]: (
      <svg aria-label="Search" fill="currentColor" role="img" viewBox="0 0 24 24" className={className}>
        <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
      </svg>
    ),
    [IconName.Reels]: (
        <svg aria-label="Reels" fill="currentColor" role="img" viewBox="0 0 24 24" className={className}>
            <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.002" x2="16.998" y1="9.002" y2="9.002"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.002" x2="16.998" y1="12" y2="12"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.002" x2="16.998" y1="15" y2="15"></line>
        </svg>
    ),
    [IconName.Shop]: (
      <svg aria-label="Shop" fill="currentColor" role="img" viewBox="0 0 24 24" className={className}>
        <path d="M12.001.504a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="2"></path>
        <path d="m15.435 15.435-6.87-6.87" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        <path d="m15.435 8.565-6.87 6.87" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
      </svg>
    ),
    [IconName.Profile]: (
      <div className={`${className} rounded-full bg-gray-300 border-2 border-gray-800`}>
        <img src="https://picsum.photos/id/237/100/100" alt="Profile" className="h-full w-full rounded-full object-cover" />
      </div>
    ),
    [IconName.Grid]: (
      <svg aria-label="Posts" fill="currentColor" role="img" viewBox="0 0 24 24" className={className}>
        <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
      </svg>
    ),
    [IconName.Tagged]: (
      <svg aria-label="Tagged" fill="currentColor" role="img" viewBox="0 0 24 24" className={className}>
        <path d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v5.259a1.59 1.59 0 0 0 .465 1.124l1.8 1.799-1.8 1.799a1.59 1.59 0 0 0-.465 1.124v5.259a1.818 1.818 0 0 1-1.818 1.818h-5.259a1.59 1.59 0 0 0-1.124.465L12 22.003l-1.799-1.8a1.59 1.59 0 0 0-1.124-.465H3.818A1.818 1.818 0 0 1 2 19.921v-5.259a1.59 1.59 0 0 0-.465-1.124L-.003 12l1.8-1.799a1.59 1.59 0 0 0 .465-1.124V3.818A1.818 1.818 0 0 1 3.818 2h5.259a1.59 1.59 0 0 0 1.124.465Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        <circle cx="12.001" cy="12.001" fill="none" r="3.108" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
      </svg>
    ),
    [IconName.Add]: (
        <svg aria-label="New post" fill="currentColor" role="img" viewBox="0 0 24 24" className={className}>
            <path d="M2 12h20M12 2v20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
    ),
    [IconName.Menu]: (
        <svg aria-label="Settings" fill="currentColor" role="img" viewBox="0 0 24 24" className={className}>
            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="4" y2="4"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="12" y2="12"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="20" y2="20"></line>
        </svg>
    ),
     [IconName.More]: (
        <svg aria-label="More options" fill="currentColor" role="img" viewBox="0 0 24 24" className={className}>
            <circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle>
        </svg>
    ),
    [IconName.Verified]: (
        <svg aria-label="Verified" className={className} fill="rgb(0, 149, 246)" role="img" viewBox="0 0 40 40">
           <path d="M19.998 3.094 14.638 0l-2.972 5.15H6.1l-1.98 5.766L.32 15.15l3.801 4.45-1.98 5.767 5.542 5.15H11.7l3.015 5.15 5.283 3.094 5.24-3.05 3.015-5.15h5.495l5.587-5.15-1.98-5.767 3.798-4.45-3.801-4.45-1.98-5.766h-5.54l-2.972-5.15Zm-2.48 21.664L10 21.08l3.56-3.56 3.94 3.94 8.49-8.49 3.56 3.56Z" fillRule="evenodd"></path>
        </svg>
    ),
    [IconName.Close]: (
        <svg aria-label="Close" className={className} fill="currentColor" role="img" viewBox="0 0 24 24">
            <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline><polyline fill="none" points="20.643 20.643 3.357 3.357" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
        </svg>
    )
  };
  return icons[name];
};
