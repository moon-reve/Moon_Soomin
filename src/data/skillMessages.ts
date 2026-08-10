export const skillSpeechMessages = {
  Figma: '기획부터 UI 디자인, 프로토타입 제작까지 가장 자주 사용했어요.',
  Photoshop: '프로젝트 이미지 제작과 보정, 필요한 비주얼 에셋을 만들 때 사용했어요.',
  Illustrator: '로고와 아이콘, 벡터 그래픽을 제작할 때 사용했어요.',
  Lightroom: '사진 작업에서 색과 톤을 정리하고, 이미지의 분위기를 다듬을 때 사용했어요.',
  'After Effects': '그래픽에 움직임을 더하고, 모션의 타이밍을 설계할 때 사용했어요.',
  'Premiere Pro': '프로젝트 시연 영상과 포트폴리오에 필요한 영상 콘텐츠를 편집할 때 사용했어요.',
  HTML: 'Marshall을 비롯한 웹 화면의 구조를 직접 구현할 때 사용했어요.',
  Javascript: 'Marshall의 인터랙션과 화면 동작을 직접 구현할 때 사용했어요.',
  React: 'Root와 viner, 그리고 이 포트폴리오를 실제 화면으로 구현할 때 사용했어요.',
  Typescript: '이 포트폴리오에서 React와 함께 사용하며 컴포넌트와 데이터 구조를 더 명확하게 관리했어요.',
  'Tailwind CSS': 'viner의 UI를 빠르게 구현하고, 반복되는 스타일을 일관되게 관리할 때 사용했어요.',
  GSAP: '이 포트폴리오의 스크롤 인터랙션과 누니의 움직임을 구현할 때 사용했어요.',
  Github: '프로젝트 코드를 관리하고, 작업 내용을 버전별로 기록할 때 사용했어요.',
  Vercel: 'React 프로젝트와 포트폴리오를 배포하고 실제 웹에서 확인할 때 사용했어요.',
  ChatGPT: '아이디어를 구체화하고, UX 흐름을 검토하고, 구현 중 막히는 문제를 해결할 때 활용해요.',
  Claude: '코드 구조를 검토하고, 복잡한 구현을 정리하거나 수정할 때 활용해요.',
  Gemini: '한 가지 답에 머물지 않도록 다른 관점과 아이디어를 비교할 때 활용해요.',
  Stitch: '초기 UI 아이디어를 빠르게 시각화하고, 화면 구성의 가능성을 탐색할 때 활용해요.',
  Midjourney: '프로젝트 컨셉에 맞는 비주얼을 탐색하고, 필요한 이미지 에셋을 제작할 때 활용해요.',
} as const;

export type SkillSpeechLabel = keyof typeof skillSpeechMessages;

export const skillInteractionGuideMessages = [
  {
    key: 'skill-throw-guide',
    message: '궁금한 스킬을 누니에게 던져보세요.',
  },
  {
    key: 'skill-catch-guide',
    message: '잡으면 어떻게 사용했는지 알려드릴게요.',
  },
] as const;

export const skillGeneralMessages = [
  '도구마다 잘하는 일이 조금씩 달라요.',
  '필요한 일에 맞춰 도구를 골라 쓰는 편이에요.',
  '보기만 한 건 아니에요. 직접 써본 것들이에요.',
  '하다 보니, 할 수 있는 게 조금씩 많아졌어요.',
] as const;

export const getSkillPriorityMessages = (state: Record<string, boolean>) => (
  state.hasThrownSkill ? [] : skillInteractionGuideMessages
);

export const getSkillMessageDisplayDuration = (message: string) => {
  if (message.length <= 38) return 4000;
  if (message.length <= 62) return 5000;
  return 6000;
};
