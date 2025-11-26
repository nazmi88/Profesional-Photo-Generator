export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNISEX = 'Unisex'
}

export enum BackgroundColor {
  WHITE = 'Off-White',
  BLUE = 'Blue',
  GREY = 'Grey',
  OFFICE = 'Blurred Office'
}

export interface OutfitOption {
  id: string;
  label: string;
  description: string;
  gender: Gender | 'All';
  promptFragment: string;
}

export interface GenerationConfig {
  gender: Gender;
  outfitId: string;
  backgroundColor: BackgroundColor;
  customPrompt: string;
}

export interface GeneratedImage {
  imageUrl: string;
  promptUsed: string;
  timestamp: number;
}