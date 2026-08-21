interface YtPlayer {
  playVideo: () => void
  pauseVideo: () => void
  destroy: () => void
}
interface YtPlayerEvent {
  target: YtPlayer
}
interface YtPlayerStateChangeEvent {
  data: number
}

interface Window {
  onYouTubeIframeAPIReady?: () => void
  YT: {
    Player: new (id: string, opciones: Record<string, unknown>) => YtPlayer
    PlayerState: {
      UNSTARTED: -1
      ENDED: 0
      PLAYING: 1
      PAUSED: 2
      BUFFERING: 3
      CUED: 5
    }
  }
}
