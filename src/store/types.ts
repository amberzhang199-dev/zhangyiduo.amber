export type PetMode = null | 'single' | 'multi';
export type AppStep = 'mode_select' | 'registration' | 'mbti_quiz' | 'chat_active';
export type Species = 'cat' | 'dog';

export interface MBTIScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  P: number;
  J: number;
}

export interface MBTIProfile {
  scores: MBTIScores;
  final_type: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'pet' | 'system';
  petId?: string;
  content: string;
  timestamp: number;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  mbti_profile: MBTIProfile;
  chat_history: ChatMessage[];
}

export interface GlobalAgentState {
  mode: PetMode;
  currentStep: AppStep;
  pets: Pet[];
}
