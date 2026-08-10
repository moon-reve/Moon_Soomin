export const heroGreeting = '어서 오세요.\n문수민의 포트폴리오에 오신 걸 환영해요.';

export const heroMessageGroups = {
  guide: [
    '제가 천천히 안내해드릴게요.',
    '궁금한 것부터 천천히 둘러보세요.',
    '준비되셨으면 같이 가볼까요?',
  ],
  appeal: [
    '생각만 하는 것보다, 직접 만들어보는 걸 좋아해요.',
    '생각에서 끝나지 않게 만드는 사람이에요.',
    '질문하고, 고민하고, 결국 직접 만들었어요.',
    '조금 더 보시면 어떤 사람인지 알게 되실 거예요.',
  ],
  wit: [
    '본인은 이런 말 잘 못해서, 제가 대신 소개하고 있어요.',
    '제가 옆에서 조금씩 알려드릴게요.',
    '생각보다 보여드릴 게 조금 많아요.',
  ],
} as const;

export type HeroMessageGroup = keyof typeof heroMessageGroups;

// 그룹별 노출 비율은 이 값만 조정하면 됩니다.
// 현재 3:4:3은 그룹 내 문장 수와 같아서 모든 문장이 동일한 확률로 선택됩니다.
export const heroMessageGroupWeights: Record<HeroMessageGroup, number> = {
  guide: 3,
  appeal: 4,
  wit: 3,
};
