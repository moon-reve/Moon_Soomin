export const journeyCommonMessages = [
  '지금의 문수민이 만들어진 과정을 보여드릴게요.',
  '하나씩 지나온 길을 따라가 볼까요?',
  '서로 다른 경험들이 지금은 하나의 강점으로 이어졌어요.',
  '경험이 쌓일수록, 사람과 문제를 보는 방식도 넓어졌어요.',
  '하나의 길만 걸어오지는 않았어요.',
] as const;

export const journeyMessages = {
  coffee: [
    '사람을 가까이에서 만나는 일부터 시작했어요.',
    '좋아하는 것과 필요한 것이 다를 수 있다는 걸 배웠어요.',
    '처음부터 화면을 보고 있던 건 아니었어요.',
  ],
  japan: [
    '그리고 익숙한 곳을 조금 멀리 떠나봤어요.',
    '다른 환경에서 일하며, 사람과 상황에 맞춰 소통하는 법을 배웠어요.',
    '조금 멀리 갔더니, 보는 것도 많아졌어요.',
  ],
  photography: [
    '이번에는 사람을 조금 다르게 보기 시작했어요.',
    '좋은 장면을 찾으면서, 작은 표정과 행동을 관찰하는 습관이 생겼어요.',
    '보고 싶은 것보다, 보이는 걸 먼저 보려고 했어요.',
  ],
  motion: [
    '멈춰 있던 장면이 움직이기 시작했어요.',
    '움직임에는 시선을 이끄는 순서와 타이밍이 있다는 걸 배웠어요.',
    '사진 한 장으로는 조금 부족했나 봐요.',
  ],
  indonesia: [
    '이번에는 더 낯선 곳으로 가봤어요.',
    '다른 환경과 사람을 경험하며, 익숙한 방식만이 답은 아니라는 걸 배웠어요.',
    '이번에는 조금 더 멀리 갔어요.',
  ],
  uiux: [
    '그리고 지나온 경험들이 여기서 하나로 연결됐어요.',
    '관찰하고, 이해하고, 표현하고, 직접 만드는 경험이 지금의 방식이 됐어요.',
    '돌아보니, 전부 여기로 이어지고 있었어요.',
  ],
} as const;

export type JourneyKey = keyof typeof journeyMessages;

export const journeySectionOrder = [
  'journey',
  'journey-discovery',
  'journey-observation',
  'journey-movement',
  'journey-expansion',
  'journey-reality',
] as const;

export const journeySectionKeyById: Record<string, JourneyKey> = {
  journey: 'coffee',
  'journey-discovery': 'japan',
  'journey-observation': 'photography',
  'journey-movement': 'motion',
  'journey-expansion': 'indonesia',
  'journey-reality': 'uiux',
};
