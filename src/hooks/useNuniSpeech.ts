import { useEffect, useRef, useState } from 'react';

type DurationRange = readonly [minimum: number, maximum: number];

export interface NuniSpeechSectionConfig {
  sectionId: string;
  messageGroups?: Record<string, readonly string[]>;
  groupWeights?: Record<string, number>;
  contextualMessages?: {
    eventName: string;
    resolveContextKey: () => string | null;
    commonMessages: readonly string[];
    specificMessages: Record<string, readonly string[]>;
    specificProbability: number;
  };
  interactionMessages?: {
    eventName: string;
    initialState: Record<string, boolean>;
    getPriorityMessages: (
      state: Record<string, boolean>,
    ) => readonly { key: string; message: string }[];
    blockGeneralUntilComplete?: boolean;
  };
  reactionMessages?: {
    eventName: string;
    messages: Record<string, string>;
    delay: DurationRange;
    getDisplayDuration: (message: string) => number;
  };
  initialDelay: DurationRange;
  displayDuration: DurationRange;
  repeatDelay: DurationRange;
  recentMessageLimit: number;
  maxRandomMessagesPerVisit?: number;
  greeting?: {
    message: string;
    delay: number;
    duration: number;
    sessionKey: string;
  };
}

const randomBetween = ([minimum, maximum]: DurationRange) => (
  minimum + Math.random() * (maximum - minimum)
);

const sessionValueExists = (key: string) => {
  try {
    return window.sessionStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
};

const rememberSessionValue = (key: string) => {
  try {
    window.sessionStorage.setItem(key, 'true');
  } catch {
    // Speech continues normally when session storage is unavailable.
  }
};

export function useNuniSpeech(
  sections: readonly NuniSpeechSectionConfig[],
  isPaused = false,
) {
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const recentMessagesRef = useRef(new Map<string, string[]>());

  useEffect(() => {
    const sectionElements = sections
      .map((config) => ({ config, element: document.getElementById(config.sectionId) }))
      .filter(
        (entry): entry is { config: NuniSpeechSectionConfig; element: HTMLElement } => (
          Boolean(entry.element)
        ),
      );
    if (sectionElements.length === 0) return undefined;

    let activeSectionId: string | null = null;
    let showTimer: number | null = null;
    let hideTimer: number | null = null;
    let revealFrame = 0;
    let messageIsShowing = false;
    const contextKeys = new Map(
      sections.map((config) => [
        config.sectionId,
        config.contextualMessages?.resolveContextKey() ?? null,
      ]),
    );
    const interactionStates = new Map(
      sections.map((config) => [
        config.sectionId,
        { ...(config.interactionMessages?.initialState ?? {}) },
      ]),
    );
    const shownPriorityMessages = new Set<string>();
    const randomMessageCounts = new Map<string, number>();

    const clearTimers = () => {
      if (showTimer !== null) window.clearTimeout(showTimer);
      if (hideTimer !== null) window.clearTimeout(hideTimer);
      if (revealFrame) window.cancelAnimationFrame(revealFrame);
      showTimer = null;
      hideTimer = null;
      revealFrame = 0;
    };

    const getActiveSection = () => {
      let activeEntry: (typeof sectionElements)[number] | null = null;
      let greatestVisibleRatio = 0;

      sectionElements.forEach((entry) => {
        const rect = entry.element.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
        );
        const visibleRatio = visibleHeight / Math.max(Math.min(rect.height, window.innerHeight), 1);
        if (visibleRatio > greatestVisibleRatio) {
          greatestVisibleRatio = visibleRatio;
          activeEntry = entry;
        }
      });

      return activeEntry;
    };

    const selectRandomMessage = (config: NuniSpeechSectionConfig) => {
      const previousMessages = recentMessagesRef.current.get(config.sectionId) ?? [];
      const recentMessages = new Set(previousMessages);
      const contextualMessages = config.contextualMessages;
      const interactionMessages = config.interactionMessages;
      let selectedMessage: string;

      if (interactionMessages) {
        const interactionState = interactionStates.get(config.sectionId) ?? {};
        const priorityMessages = interactionMessages.getPriorityMessages(interactionState);
        const priorityMessage = priorityMessages.find(({ key }) => (
          !shownPriorityMessages.has(`${config.sectionId}:${key}`)
        ));
        if (priorityMessage) {
          const priorityId = `${config.sectionId}:${priorityMessage.key}`;
          shownPriorityMessages.add(priorityId);
          return priorityMessage.message;
        }
        if (interactionMessages.blockGeneralUntilComplete && priorityMessages.length > 0) {
          return null;
        }
      }

      if (contextualMessages) {
        const contextKey = contextKeys.get(config.sectionId);
        const specificMessages = contextKey
          ? contextualMessages.specificMessages[contextKey]
          : undefined;
        const useSpecificMessage = Boolean(specificMessages?.length)
          && Math.random() < contextualMessages.specificProbability;
        const preferredPool = useSpecificMessage
          ? specificMessages ?? []
          : contextualMessages.commonMessages;
        const availableMessages = preferredPool.filter(
          (candidate) => !recentMessages.has(candidate),
        );
        const fallbackPool = availableMessages.length > 0
          ? availableMessages
          : preferredPool.length > 0
            ? preferredPool
            : contextualMessages.commonMessages;
        selectedMessage = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
      } else {
        const messageGroups = config.messageGroups ?? {};
        const groupWeights = config.groupWeights ?? {};
        let groupCandidates = Object.entries(messageGroups)
        .map(([group, messages]) => ({
          group,
          messages: messages.filter((candidate) => !recentMessages.has(candidate)),
          weight: Math.max(0, groupWeights[group] ?? 1),
        }))
        .filter(({ messages, weight }) => messages.length > 0 && weight > 0);
        if (groupCandidates.length === 0) {
          groupCandidates = Object.entries(messageGroups)
            .map(([group, messages]) => ({
              group,
              messages: [...messages],
              weight: Math.max(0, groupWeights[group] ?? 1),
            }))
            .filter(({ messages, weight }) => messages.length > 0 && weight > 0);
        }
        const totalWeight = groupCandidates.reduce((sum, candidate) => sum + candidate.weight, 0);
        let weightedPosition = Math.random() * totalWeight;
        const selectedGroup = groupCandidates.find((candidate) => {
          weightedPosition -= candidate.weight;
          return weightedPosition < 0;
        }) ?? groupCandidates[0];
        selectedMessage = selectedGroup.messages[
          Math.floor(Math.random() * selectedGroup.messages.length)
        ];
      }

      recentMessagesRef.current.set(
        config.sectionId,
        [selectedMessage, ...previousMessages].slice(0, config.recentMessageLimit),
      );
      return selectedMessage;
    };

    const showMessage = (
      config: NuniSpeechSectionConfig,
      nextMessage: string,
      duration: number,
      onHidden: () => void,
    ) => {
      if (activeSectionId !== config.sectionId || isPaused) return;
      setMessage(nextMessage);
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = 0;
        if (activeSectionId === config.sectionId && !isPaused) {
          messageIsShowing = true;
          setIsVisible(true);
        }
      });
      hideTimer = window.setTimeout(() => {
        hideTimer = null;
        messageIsShowing = false;
        setIsVisible(false);
        onHidden();
      }, duration);
    };

    const scheduleRandomMessage = (
      config: NuniSpeechSectionConfig,
      delayRange: DurationRange,
    ) => {
      if (activeSectionId !== config.sectionId || isPaused) return;
      const randomMessageCount = randomMessageCounts.get(config.sectionId) ?? 0;
      if (
        config.maxRandomMessagesPerVisit !== undefined
        && randomMessageCount >= config.maxRandomMessagesPerVisit
      ) return;
      showTimer = window.setTimeout(() => {
        showTimer = null;
        if (activeSectionId !== config.sectionId || isPaused) return;
        const nextMessage = selectRandomMessage(config);
        if (!nextMessage) {
          scheduleRandomMessage(config, config.repeatDelay);
          return;
        }
        randomMessageCounts.set(config.sectionId, randomMessageCount + 1);
        showMessage(
          config,
          nextMessage,
          randomBetween(config.displayDuration),
          () => scheduleRandomMessage(config, config.repeatDelay),
        );
      }, randomBetween(delayRange));
    };

    const startSectionCycle = (config: NuniSpeechSectionConfig) => {
      clearTimers();
      const greeting = config.greeting;
      if (!greeting || sessionValueExists(greeting.sessionKey)) {
        scheduleRandomMessage(config, config.initialDelay);
        return;
      }

      showTimer = window.setTimeout(() => {
        showTimer = null;
        if (activeSectionId !== config.sectionId || isPaused) return;
        rememberSessionValue(greeting.sessionKey);
        showMessage(
          config,
          greeting.message,
          greeting.duration,
          () => scheduleRandomMessage(config, config.repeatDelay),
        );
      }, greeting.delay);
    };

    const syncActiveSection = () => {
      const nextSection = isPaused ? null : getActiveSection();
      const nextSectionId = nextSection?.config.sectionId ?? null;
      if (nextSectionId === activeSectionId) return;

      activeSectionId = nextSectionId;
      clearTimers();
      messageIsShowing = false;
      setIsVisible(false);
      if (nextSection) {
        randomMessageCounts.set(nextSection.config.sectionId, 0);
        startSectionCycle(nextSection.config);
      }
    };

    const contextListeners = sections.flatMap((config) => {
      const contextualMessages = config.contextualMessages;
      if (!contextualMessages) return [];

      const handleContextChange = (event: Event) => {
        const nextContextKey = (event as CustomEvent<string | null>).detail ?? null;
        if (contextKeys.get(config.sectionId) === nextContextKey) return;
        contextKeys.set(config.sectionId, nextContextKey);
        if (activeSectionId !== config.sectionId || messageIsShowing) return;

        clearTimers();
        setIsVisible(false);
        scheduleRandomMessage(config, config.initialDelay);
      };

      window.addEventListener(contextualMessages.eventName, handleContextChange);
      return [{ eventName: contextualMessages.eventName, handleContextChange }];
    });

    const interactionListeners = sections.flatMap((config) => {
      const interactionMessages = config.interactionMessages;
      if (!interactionMessages) return [];

      const handleInteractionChange = (event: Event) => {
        const stateUpdate = (event as CustomEvent<Record<string, boolean>>).detail ?? {};
        const currentState = interactionStates.get(config.sectionId) ?? {};
        interactionStates.set(config.sectionId, { ...currentState, ...stateUpdate });
        if (activeSectionId !== config.sectionId || messageIsShowing) return;

        clearTimers();
        setIsVisible(false);
        scheduleRandomMessage(config, config.initialDelay);
      };

      window.addEventListener(interactionMessages.eventName, handleInteractionChange);
      return [{ eventName: interactionMessages.eventName, handleInteractionChange }];
    });

    const reactionListeners = sections.flatMap((config) => {
      const reactionMessages = config.reactionMessages;
      if (!reactionMessages) return [];

      const handleReaction = (event: Event) => {
        const reactionKey = (event as CustomEvent<string>).detail;
        const reactionMessage = reactionMessages.messages[reactionKey];
        if (!reactionMessage || activeSectionId !== config.sectionId || isPaused) return;

        clearTimers();
        messageIsShowing = false;
        setIsVisible(false);
        showTimer = window.setTimeout(() => {
          showTimer = null;
          if (activeSectionId !== config.sectionId || isPaused) return;
          showMessage(
            config,
            reactionMessage,
            reactionMessages.getDisplayDuration(reactionMessage),
            () => scheduleRandomMessage(config, config.repeatDelay),
          );
        }, randomBetween(reactionMessages.delay));
      };

      window.addEventListener(reactionMessages.eventName, handleReaction);
      return [{ eventName: reactionMessages.eventName, handleReaction }];
    });

    syncActiveSection();
    window.addEventListener('scroll', syncActiveSection, { passive: true });
    window.addEventListener('resize', syncActiveSection);

    return () => {
      clearTimers();
      contextListeners.forEach(({ eventName, handleContextChange }) => {
        window.removeEventListener(eventName, handleContextChange);
      });
      interactionListeners.forEach(({ eventName, handleInteractionChange }) => {
        window.removeEventListener(eventName, handleInteractionChange);
      });
      reactionListeners.forEach(({ eventName, handleReaction }) => {
        window.removeEventListener(eventName, handleReaction);
      });
      window.removeEventListener('scroll', syncActiveSection);
      window.removeEventListener('resize', syncActiveSection);
      setIsVisible(false);
    };
  }, [isPaused, sections]);

  return { message, isVisible };
}
