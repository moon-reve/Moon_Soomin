import { useContext } from 'react';
import { GuideContext } from '../contexts/GuideContext';

export function useGuide() {
  const context = useContext(GuideContext);

  if (!context) {
    throw new Error('useGuide must be used within GuideProvider');
  }

  return context;
}
