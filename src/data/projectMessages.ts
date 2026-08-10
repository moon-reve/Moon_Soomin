export interface ProjectInteractionState {
  hasClickedProject: boolean;
  hasUsedFlip: boolean;
  hasOpenedPage: boolean;
}

export const initialProjectInteractionState: ProjectInteractionState = {
  hasClickedProject: false,
  hasUsedFlip: false,
  hasOpenedPage: false,
};

export const projectGuideMessages = {
  cardClick: '프로젝트 카드를 클릭해보세요.\n더 자세한 이야기가 있어요.',
  flip: 'FLIP을 눌러보세요.\n뒤쪽에 OPEN PAGE가 숨어 있어요.',
  openPage: 'OPEN PAGE를 누르면\n실제 구현 화면도 확인할 수 있어요.',
} as const;

export const getProjectPriorityMessages = (state: Record<string, boolean>) => {
  if (!state.hasClickedProject) {
    return [{ key: 'card-click', message: projectGuideMessages.cardClick }];
  }
  if (!state.hasUsedFlip) {
    return [{ key: 'flip', message: projectGuideMessages.flip }];
  }
  if (!state.hasOpenedPage) {
    return [{ key: 'open-page', message: projectGuideMessages.openPage }];
  }
  return [];
};

export const projectMessageGroups = {
  appeal: [
    '아이디어를 실제 화면까지 이어가는 과정을 담았어요.',
    '기획부터 구현까지, 직접 연결해본 프로젝트들이에요.',
  ],
  wit: [
    '카드 뒤쪽까지 꼼꼼하게 살펴보셨네요.',
    '보여드리고 싶었던 이야기를 모두 찾으셨어요.',
  ],
} as const;

export type ProjectMessageGroup = keyof typeof projectMessageGroups;

export const projectMessageGroupWeights: Record<ProjectMessageGroup, number> = {
  appeal: 2,
  wit: 2,
};
