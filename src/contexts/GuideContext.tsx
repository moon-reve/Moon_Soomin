import { createContext } from 'react';
import type { GuideId } from '../data/guides';

export interface GuideContextValue {
  selectedGuide: GuideId;
  selectGuide: (guide: GuideId) => void;
}

export const GuideContext = createContext<GuideContextValue | undefined>(undefined);
