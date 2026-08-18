import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useBrowserNotification } from './useBrowserNotification'

const stagesTimes = {
  pomodoro: minutesToMilliseconds(25),
  shortBreak: minutesToMilliseconds(5),
  longBreak: minutesToMilliseconds(15)
} as const

export type Stage = keyof typeof stagesTimes

function minutesToMilliseconds(minutes: number) {
  return minutes * 60 * 1000
}

function pad(num: number, padding = 2) {
  return num.toString().padStart(padding, '0')
}

export function usePomodoro() {
  const currentStage = ref<Stage>('pomodoro')
  const isRunning = ref(false)
  const isPlayerReady = ref(false)
  const pomodoroCount = ref(1)
  const elapsedTime = ref(0)

  const { showNotification } = useBrowserNotification()

  const formattedTime = computed(() => {
    const remainingTime = stagesTimes[currentStage.value] - elapsedTime.value

    const minute = Math.floor(remainingTime / 60000)
    const second = Math.floor((remainingTime % 60000) / 1000)

    return `${pad(minute)}:${pad(second)}`
  })

  let player: YtPlayer | null = null
  let shortBreakCount = 0
  let timerInterval: ReturnType<typeof setInterval> | null = null
  let startTime = 0
  let isComponentMounted = false

  onUnmounted(() => {
    isComponentMounted = false

    if (window.onYouTubeIframeAPIReady) window.onYouTubeIframeAPIReady = undefined
    if (timerInterval) clearInterval(timerInterval)
    if (player) player.destroy()
  })

  onMounted(() => {
    isComponentMounted = true

    if (window.YT && window.YT.Player) {
      initPlayer()
      return
    }

    window.onYouTubeIframeAPIReady = () => {
      initPlayer()
    }

    initIframeScript()
  })

  function initPlayer() {
    if (!isComponentMounted) return

    if (!document.getElementById('player')) return

    player = new window.YT.Player('player', {
      height: '200',
      width: '200',
      playerVars: {
        playsinline: 1,
        controls: 0,
        listType: 'playlist',
        list: 'PL6NdkXsPL07Il2hEQGcLI4dg_LTg7xA2L'
      },
      events: {
        onReady: onPlayerReady
      }
    })
  }

  function onPlayerReady() {
    isPlayerReady.value = true
  }

  function initIframeScript() {
    const scriptId = 'youtube-iframe-script'

    if (document.getElementById(scriptId)) return

    const tag = document.createElement('script')
    tag.id = scriptId
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]

    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }
  }

  function pauseStopwatch() {
    if (!timerInterval) return

    clearInterval(timerInterval)
    timerInterval = null
    isRunning.value = false
  }

  function skip() {
    restore()
    if (currentStage.value !== 'pomodoro') {
      startPomodoro()
      return
    }
    if (shortBreakCount < 3) {
      startShortBreak()
      return
    }
    startLongBreak()
  }

  function restore() {
    pause()
    elapsedTime.value = 0
    startTime = 0
  }

  function playVideo() {
    if (!player) return

    player.playVideo()
  }

  function pauseVideo() {
    if (!player) return

    player.pauseVideo()
  }

  function switchToPomodoro() {
    if (currentStage.value === 'pomodoro') return
    restore()
    startPomodoro()
  }

  function switchToShortBreak() {
    if (currentStage.value === 'shortBreak') return
    restore()
    startShortBreak()
  }

  function switchToLongBreak() {
    if (currentStage.value === 'longBreak') return
    restore()
    startLongBreak()
  }

  function startPomodoro() {
    currentStage.value = 'pomodoro'
    pomodoroCount.value++
    playVideo()
    startStopwatch()
  }

  function startShortBreak() {
    currentStage.value = 'shortBreak'
    shortBreakCount++
    startBreak()
  }

  function startLongBreak() {
    currentStage.value = 'longBreak'
    shortBreakCount = 0
    startBreak()
  }

  function startBreak() {
    pauseVideo()
    startStopwatch()
  }

  function notifyStageCompletion() {
    showNotification(currentStage.value)
  }

  function startStopwatch() {
    startTime = Date.now() - elapsedTime.value
    isRunning.value = true

    timerInterval = setInterval(() => {
      elapsedTime.value = Date.now() - startTime

      if (elapsedTime.value <= stagesTimes[currentStage.value]) return

      notifyStageCompletion()
      skip()
    }, 200)
  }

  function start() {
    if (isRunning.value) return

    if (currentStage.value === 'pomodoro') {
      playVideo()
    }

    startStopwatch()
  }

  function pause() {
    if (!isRunning.value) return

    pauseVideo()
    pauseStopwatch()
  }

  return {
    isPlayerReady,
    isRunning,
    formattedTime,
    start,
    pause,
    restore,
    skip,
    currentStage,
    switchToPomodoro,
    switchToLongBreak,
    switchToShortBreak,
    pomodoroCount
  }
}
