// Controls the flow of audio playback, allowing pausing, resuming, and stopping.

export const PlaybackFlowState = {
  Running: 'running',
  Paused: 'paused',
  Stopped: 'stopped',
} as const;

export type PlaybackFlowState =
  (typeof PlaybackFlowState)[keyof typeof PlaybackFlowState];

export function createPlaybackFlowController() {
  let state: PlaybackFlowState = PlaybackFlowState.Running;
  let resumeResolvers: Array<() => void> = [];

  function pause() {
    if (state !== PlaybackFlowState.Running) return;
    state = PlaybackFlowState.Paused;
  }

  function resume() {
    if (state !== PlaybackFlowState.Paused) return;

    state = PlaybackFlowState.Running;
    const resolvers = resumeResolvers;
    resumeResolvers = [];
    resolvers.forEach((resolve) => resolve());
  }

  function stop() {
    state = PlaybackFlowState.Stopped;

    const resolvers = resumeResolvers;
    resumeResolvers = [];
    resolvers.forEach((resolve) => resolve());
  }

  function getState() {
    return state;
  }

  async function waitIfPaused() {
    while (state === PlaybackFlowState.Paused) {
      await new Promise<void>((resolve) => {
        resumeResolvers.push(resolve);
      });
    }

    if (state === PlaybackFlowState.Stopped) {
      return PlaybackFlowState.Stopped;
    }

    return PlaybackFlowState.Running;
  }

  return {
    pause,
    resume,
    stop,
    getState,
    waitIfPaused,
  };
}

export type PlaybackFlowController = ReturnType<
  typeof createPlaybackFlowController
>;
