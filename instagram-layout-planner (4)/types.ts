
export type Image = {
  id: string;
  src: string;
};

export type DragItem = 
  | { type: 'panel'; image: Image; index: number }
  | { type: 'grid'; image: Image; index: number };

export interface StoryHighlight {
  id: string;
  imageSrc: string;
  name: string;
}

export interface ProfileData {
  username: string;
  avatar: string;
  posts: string;
  followers: string;
  following: string;
  name: string;
  category: string;
  bio: string;
  link: string;
  highlights: StoryHighlight[];
}

export enum IconName {
  Home,
  Search,
  Reels,
  Shop,
  Profile,
  Grid,
  Tagged,
  Add,
  Menu,
  More,
  Verified,
  Close,
}