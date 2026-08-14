import type { GuideId } from './guides';
import type { SkillSpeechLabel } from './skillMessages';

export type GuidedTourStep = {
  id: string;
  targetId?: string;
  duration: number;
  speech?: string;
  project?: 'marshall' | 'route' | 'viner';
  skill?: SkillSpeechLabel;
};

const heroGuideMessages: Record<GuideId, string> = {
  curator: '다양한 경험이 지금의 문수민에게\n어떤 의미로 남았는지 보여드릴게요.',
  strategist: '문제를 발견하고,\n해결할 방법을 찾아가는 과정을 보여드릴게요.',
  builder: '생각에서 끝내지 않고,\n직접 결과물로 만드는 과정을 보여드릴게요.',
  explorer: '새로운 경험과 호기심이\n어디까지 이어졌는지 함께 둘러볼까요?',
};

const guideSettings = {
  curator: {
    emphasizedJourneys: ['journey-discovery', 'journey-observation', 'journey-movement', 'journey-reality'],
    project: 'marshall',
    skill: 'Figma',
  },
  strategist: {
    emphasizedJourneys: ['journey', 'journey-reality'],
    project: 'route',
    skill: 'ChatGPT',
  },
  builder: {
    emphasizedJourneys: ['journey-movement', 'journey-reality'],
    project: 'viner',
    skill: 'GSAP',
  },
  explorer: {
    emphasizedJourneys: ['journey-discovery', 'journey-expansion', 'journey-reality'],
    project: 'viner',
    skill: 'Stitch',
  },
} as const satisfies Record<GuideId, {
  emphasizedJourneys: readonly string[];
  project: 'marshall' | 'route' | 'viner';
  skill: SkillSpeechLabel;
}>;

const journeyIds = [
  'journey',
  'journey-discovery',
  'journey-observation',
  'journey-movement',
  'journey-expansion',
  'journey-reality',
] as const;

const strategistJourneySpeech: Partial<Record<string, string>> = {
  journey: '좋아하는 것과 필요한 것이 항상 같지는 않다는 걸,\n사람을 직접 만나며 먼저 배웠어요.',
  'journey-reality': '지금은 그 차이를 관찰하고,\n문제를 정의해 해결하는 방법을 고민해요.',
};

const guideJourneySpeech: Record<GuideId, Partial<Record<string, string>>> = {
  curator: {
    'journey-discovery': '다른 환경에서 일하며, 상황에 맞춰 소통하는 법을 배웠어요.',
    'journey-observation': '작은 표정과 행동을 관찰하는 습관이 생겼어요.',
    'journey-movement': '움직임으로 시선을 이끄는 순서와 타이밍을 배웠어요.',
    'journey-reality': '관찰하고 표현한 경험들이 지금의 방식으로 연결됐어요.',
  },
  strategist: strategistJourneySpeech,
  builder: {
    'journey-movement': '멈춰 있던 장면을 움직이는 표현으로 확장했어요.',
    'journey-reality': '이제는 직접 작동하는 경험을 만들고 있어요.',
  },
  explorer: {
    'journey-discovery': '익숙한 곳을 떠나 더 넓게 보는 법을 배웠어요.',
    'journey-expansion': '낯선 환경에서 익숙한 방식만이 답은 아님을 배웠어요.',
    'journey-reality': '새로운 경험들이 지금의 가능성으로 이어졌어요.',
  },
};

const guidedSkillSpeech: Record<GuideId, string> = {
  curator: '기획부터 UI 디자인, 프로토타입 제작까지 가장 자주 사용했어요.',
  strategist: '아이디어를 구체화하고, UX 흐름을 검토할 때 활용해요.',
  builder: '이 포트폴리오의 스크롤과 누니의 움직임을 구현할 때 사용했어요.',
  explorer: '초기 UI 아이디어와 화면 구성을 빠르게 탐색할 때 활용해요.',
};

const guidedProjectSpeech: Record<GuideId, string> = {
  curator: '브랜드의 이야기를 인터랙션으로 다시 풀어냈어요.',
  strategist: '사용자의 취업 준비 과정을 문제부터 다시 설계했어요.',
  builder: '기획과 디자인을 실제 작동하는 화면까지 직접 이어갔어요.',
  explorer: '필요한 기능을 만나면 새로운 방법을 배우면서 해결해봤어요.',
};

export function createGuidedTourSteps(guide: GuideId): GuidedTourStep[] {
  const settings = guideSettings[guide];
  const journeySteps = journeyIds.map((targetId) => {
    const emphasized = settings.emphasizedJourneys.includes(targetId);
    return {
      id: `journey-${targetId}`,
      targetId,
      duration: emphasized ? 4 : 3,
      speech: guideJourneySpeech[guide][targetId],
    };
  });

  return [
    { id: 'hero-welcome', targetId: 'hero', duration: 4, speech: '어서 오세요.\n문수민의 포트폴리오에 오신 걸 환영해요.' },
    { id: 'hero-guide', duration: 3, speech: '제가 천천히 안내해드릴게요.' },
    { id: 'hero-specific', duration: 4, speech: heroGuideMessages[guide] },
    { id: 'about', targetId: 'about', duration: 4, speech: '다양한 경험이 지금의 문수민을 만들었어요.' },
    ...journeySteps,
    {
      id: 'projects',
      targetId: 'projects',
      duration: 12,
      project: settings.project,
      speech: guidedProjectSpeech[guide],
    },
    { id: 'skills-arrival', targetId: 'skills', duration: 4 },
    {
      id: 'skills-throw',
      duration: 14,
      skill: settings.skill,
      speech: guidedSkillSpeech[guide],
    },
    { id: 'skills-try', duration: 3.5, speech: '궁금한 스킬은 직접 던져보셔도 돼요.' },
    { id: 'skills-interaction-space', duration: 1 },
    { id: 'contact', targetId: 'contact', duration: 4.5, speech: '이제 문수민과 직접 대화할 시간이에요.' },
  ];
}
