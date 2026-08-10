export const aboutMessageGroups = {
  guide: [
    '어떤 사람인지 조금 더 보여드릴게요.',
    '지나온 경험도 천천히 둘러보세요.',
    '지금의 문수민이 어떻게 만들어졌는지 볼까요?',
  ],
  appeal: [
    '다양한 경험 덕분에, 사람과 경험을 보는 시야도 넓어졌어요.',
    '해본 일이 많아서, 서로 다른 경험을 연결하는 데 익숙해요.',
  ],
  wit: [
    '생각보다 이것저것 많이 해봤어요.',
  ],
} as const;

export type AboutMessageGroup = keyof typeof aboutMessageGroups;

// 현재는 모든 문장이 같은 확률입니다. 그룹별 노출 비율은 이 값만 조정하면 됩니다.
export const aboutMessageGroupWeights: Record<AboutMessageGroup, number> = {
  guide: 3,
  appeal: 2,
  wit: 1,
};
