export const contactMainMessage = '이제 문수민과 직접 대화할 시간이에요.';

export const contactMessageGroups = {
  guide: [
    '궁금한 이야기가 남았다면 편하게 연락해주세요.',
    '화면에서 못다 한 이야기는 직접 들려드릴게요.',
    '함께 이야기해보고 싶다면, 여기서 연락할 수 있어요.',
  ],
  closing: [
    '여기까지 보셨다면, 어떤 사람인지는 조금 보여드린 것 같아요.',
    '생각하고, 만들고, 계속 배우는 사람으로 기억해주시면 좋겠어요.',
  ],
} as const;

export type ContactMessageGroup = keyof typeof contactMessageGroups;

// 그룹 내 모든 문장이 같은 확률로 선택되도록 문장 수와 동일하게 설정합니다.
export const contactMessageGroupWeights: Record<ContactMessageGroup, number> = {
  guide: 3,
  closing: 2,
};
