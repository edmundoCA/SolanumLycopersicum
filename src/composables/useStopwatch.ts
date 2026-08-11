import { ref, computed, onUnmounted, onMounted } from 'vue'

export function useStopwatch() {
  const player = ref<YtPlayer | null>(null)
  const baseUrl = import.meta.env.BASE_URL
  const minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000
  const stages = {
    pomodoro: minutesToMilliseconds(20),
    shortBreak: minutesToMilliseconds(5),
    longBreak: minutesToMilliseconds(15)
  } as const
  type Stage = keyof typeof stages
  const sequence: Stage[] = [
    'pomodoro',
    'shortBreak',
    'pomodoro',
    'shortBreak',
    'pomodoro',
    'shortBreak',
    'pomodoro',
    'longBreak'
  ]
  const sequenceIndex = ref(0)
  const isRunning = ref(false)
  const isPlayerReady = ref(false)
  const pomodoroCount = computed(() => Math.floor(stageCount.value / 2) + 1)
  const remainingTime = ref(stages.pomodoro)
  const elapsedTime = ref(0)
  const stageCount = ref(0)

  let timerInterval: ReturnType<typeof setInterval> | null = null
  let startTime = 0

  const start = () => {
    if (isRunning.value) return
    playvideo()

    isRunning.value = true
    startTime = Date.now() - elapsedTime.value

    timerInterval = setInterval(() => {
      elapsedTime.value = Date.now() - startTime
      remainingTime.value = stages[sequence[sequenceIndex.value]] - elapsedTime.value

      if (remainingTime.value > 0) return

      skip()
    }, 10)
  }

  const pause = () => {
    if (!isRunning.value) return
    stopVideo()

    isRunning.value = false
    if (timerInterval) clearInterval(timerInterval)
  }

  const formattedTime = computed(() => {
    const date = new Date(remainingTime.value)

    const minutes = date.getUTCMinutes()
    const seconds = date.getUTCSeconds()

    const pad = (num: number, padding = 2) => num.toString().padStart(padding, '0')

    return `${pad(minutes)}:${pad(seconds)}`
  })

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
  })

  onMounted(() => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }
    window.onYouTubeIframeAPIReady = () => {
      player.value = new window.YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'M7lc1UVf-VE',
        playerVars: {
          playsinline: 1
        },
        events: {
          onReady: onPlayerReady
        }
      })
    }
    function onPlayerReady() {
      isPlayerReady.value = true
    }
  })

  return {
    isPlayerReady,
    isRunning,
    formattedTime,
    start,
    pause,
    restore,
    skip,
    baseUrl,
    pomodoroCount
  }

  function skip() {
    sequenceIndex.value = ++stageCount.value % sequence.length
    restore()
  }

  function restore() {
    elapsedTime.value = 0
    startTime = Date.now()
    remainingTime.value = stages[sequence[sequenceIndex.value]]
  }
  function playvideo() {
    if (player.value) {
      player.value.playVideo()
    }
  }
  function stopVideo() {
    if (player.value) {
      player.value.pauseVideo()
    }
  }
}
