import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { DEFAULT_GUIDE, isGuideId, type GuideId } from '../data/guides';
import { GuideContext } from './GuideContext';

const GUIDE_STORAGE_KEY = 'moon-soomin:selected-guide';

function getInitialGuide(): GuideId {
  if (typeof window === 'undefined') return DEFAULT_GUIDE;

  const storedGuide = window.sessionStorage.getItem(GUIDE_STORAGE_KEY);
  return isGuideId(storedGuide) ? storedGuide : DEFAULT_GUIDE;
}

export default function GuideProvider({ children }: PropsWithChildren) {
  const [selectedGuide, setSelectedGuide] = useState<GuideId>(getInitialGuide);

  const selectGuide = useCallback((guide: GuideId) => {
    setSelectedGuide(guide);
    window.sessionStorage.setItem(GUIDE_STORAGE_KEY, guide);
  }, []);

  const value = useMemo(
    () => ({ selectedGuide, selectGuide }),
    [selectedGuide, selectGuide],
  );

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}
