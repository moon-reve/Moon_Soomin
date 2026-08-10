export const guides = [
  {
    id: 'curator',
    label: 'Curator',
    name: '큐레이터',
    description: '경험 속 의미와 맥락을 골라 보여드립니다.',
  },
  {
    id: 'strategist',
    label: 'Strategist',
    name: '전략가',
    description: '무엇부터 할지 순서를 잡아 줍니다.',
  },
  {
    id: 'builder',
    label: 'Builder',
    name: '빌더',
    description: '아이디어를 실제 결과물로 만들어 냅니다.',
  },
  {
    id: 'explorer',
    label: 'Explorer',
    name: '탐험가',
    description: '새로운 가능성을 따라 함께 탐색합니다.',
  },
] as const;

export type GuideId = (typeof guides)[number]['id'];

export const DEFAULT_GUIDE: GuideId = 'strategist';

export function isGuideId(value: unknown): value is GuideId {
  return guides.some(({ id }) => id === value);
}
